// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::Path, io::Write, fs, collections::HashMap, sync::{Arc, Mutex}};
use tauri::{plugin::{Builder as PluginBuilder, TauriPlugin}, Runtime};
use tauri::api::dialog::blocking::FileDialogBuilder;
use tauri::api::process::{Command, CommandEvent, CommandChild};
use relative_path::RelativePath;
use ureq;

mod tauri_bridge;

#[derive(Clone, serde::Serialize)]
struct ChildProcessDataPayload {
    pid: String,
    data: String
}

#[derive(Clone, serde::Serialize)]
struct ChildProcessExitPayload {
    pid: String,
    code: String,
    signal: String
}

#[derive(Default, serde::Deserialize)]
struct ServerApiResponse {
    release_version_public: String
}

struct AppState {
    active_processes: Arc<Mutex<HashMap<String, CommandChild>>>
}

fn get_files(paths: &mut Vec<String>, path: &Path, recursive: bool) -> std::io::Result<()> {
    for entry in std::fs::read_dir(path)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            get_files(paths, &path, recursive)?;
        } else {
            paths.push(path.to_str().unwrap().to_string());
        }
    }

    Ok(())
}

#[tauri::command]
async fn tauri_api(
    window: tauri::Window,
    state: tauri::State<'_, AppState>,
    operation: String,
    args: Vec<String>,
    data: Vec<u8>
) -> Result<Vec<String>, String> {
    //dbg!(&operation);
    match operation.as_str() {
        "openScaffoldDirectory" => {
            let dialog_result = FileDialogBuilder::new()
                .set_title("Please select your battlecode-scaffold directory")
                .pick_folder();
            match dialog_result {
                Some(d) => Ok(vec!(d.to_str().unwrap().to_string())),
                None => Ok(vec!())
            }
        },
        "getRootPath" => {
            let exec_dir = std::env::current_exe();
            Ok(vec!(exec_dir.unwrap().to_str().unwrap().to_string()))
        },
        "getJavas" => {
            let mut output = vec![];
            let jvms = javalocate::run(&javalocate::Args {
                name: None,
                arch: None,
                version: Some(String::from("1.8"))
            });

            for jvm in jvms {
                output.push(format!(
                    "{} ({})",
                    jvm.version,
                    jvm.architecture
                ));
                output.push(jvm.path);
            }

            Ok(output)
        },
        "exportMap" => {
            let dialog_result = FileDialogBuilder::new()
                .set_title("Export map")
                .set_file_name(&args[0])
                .save_file();
            match dialog_result {
                Some(d) => {
                    if let Ok(mut file) = fs::File::create(d) {
                        let _ = file.write_all(&data);
                    }
                }
                None => {}
            }

            Ok(vec![])
        },
        "getServerVersion" => {
            let mut version = String::new();
            let uri = format!("https://api.battlecode.org/api/episode/e/bc{}/?format=json", &args[0]);
            if let Ok(res) = ureq::get(&uri).call() {
                let res: ServerApiResponse = res.into_json().unwrap_or(Default::default());
                version = res.release_version_public;
            }

            Ok(vec![version])
        },
        "path.join" => {
            let mut final_path = std::path::PathBuf::new();
            for ele in args {
                final_path.push(ele);
            }
            Ok(vec!(final_path.to_str().unwrap().to_string()))
        },
        "path.relative" => {
            let path_from = RelativePath::new(&args[0]);
            let path_to = RelativePath::new(&args[1]);
            let result = path_from.relative(path_to);
            Ok(vec!(result.to_string()))
        },
        "path.dirname" => {
            let path = Path::new(&args[0]).parent().unwrap_or(Path::new(""));
            Ok(vec!(path.to_str().unwrap().to_string()))
        },
        "path.sep" => {
            Ok(vec!(std::path::MAIN_SEPARATOR_STR.to_string()))
        },
        "fs.existsSync" => {
            Ok(vec!(match std::path::Path::new(&args[0]).exists() {
                true => "true".to_string(),
                false => String::new()
            }))
        },
        "fs.mkdirSync" => {
            let _ = std::fs::create_dir(&args[0]);
            Ok(vec!(String::new()))
        },
        "fs.getFiles" => {
            let path = &args[0];
            let recursive = match args.len() {
                1 => false,
                _ => args[1] == "true"
            };
            let mut result: Vec<String> = vec!();
            match get_files(&mut result, Path::new(path), recursive) {
                Ok(_) => Ok(result),
                Err(_) => Ok(vec!())
            }
        },
        "child_process.spawn" => {
            let scaffold_path = &args[0];
            let java_path = &args[1];
            let mut wrapper_path = std::path::PathBuf::new();
            wrapper_path.push(scaffold_path);
            wrapper_path.push(match cfg!(windows) {
                true => "gradlew.bat",
                false => "gradlew"
            });
            let mut child = Command::new(wrapper_path.to_str().unwrap())
                .args(&args[2..])
                .current_dir(scaffold_path.into());
            if !java_path.is_empty() {
                let mut envs = HashMap::new();
                envs.insert(String::from("JAVA_HOME"), java_path.clone());
                child = child.envs(envs);
            }
            let child = child.spawn();
            if let Ok(child) = child {
                let mut rx = child.0;
                let child = child.1;
                let pid = child.pid();
                let pid_str = pid.to_string();
                let active_processes = state.active_processes.clone();
                std::thread::spawn(move || {
                    //dbg!("Child process event thread spawned");
                    loop {
                        match rx.blocking_recv() {
                            Some(msg) => match msg {
                                CommandEvent::Stdout(data) => {
                                    let _ = window.emit(
                                        "child-process-stdout",
                                        ChildProcessDataPayload { pid: pid.to_string(), data }
                                    );
                                },
                                CommandEvent::Stderr(data) | CommandEvent::Error(data) => {
                                    let _ = window.emit(
                                        "child-process-stderr",
                                        ChildProcessDataPayload { pid: pid.to_string(), data }
                                    );
                                },
                                CommandEvent::Terminated(term) => {
                                    let _ = window.emit(
                                        "child-process-exit",
                                        ChildProcessExitPayload {
                                            pid: pid.to_string(),
                                            code: term.code.unwrap_or(0).to_string(),
                                            signal: term.signal.unwrap_or(0).to_string()
                                        }
                                    );
                                }
                                _ => {}
                            },
                            None => break
                        }
                    }

                    active_processes.lock().unwrap().remove(&pid.to_string());
                    //dbg!("Child process event thread finished");
                });

                state.active_processes.lock().unwrap().insert(pid_str.clone(), child);

                Ok(vec!(pid_str.clone()))
            } else {
                Err("Failed to spawn process".to_string())
            }
        },
        "child_process.kill" => {
            let pid = &args[0];
            match state.active_processes.lock().unwrap().remove(pid) {
                Some(child) => {
                    let _ = child.kill();
                },
                None => {}
            };
            Ok(vec!(String::new()))
        },
        _ => Err("Invalid native API operation".to_string())
    }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    PluginBuilder::new("window")
        .setup(|_app| {
            Ok(())
        })
        .on_event(|_app, event| {
            match event {
                _ => ()
            }
        })
        .js_init_script(tauri_bridge::SOURCE.to_string())
        .build()
}

fn main() {
    tauri::Builder::default()
        .plugin(init())
        .manage(AppState { active_processes: Default::default() })
        .invoke_handler(tauri::generate_handler![tauri_api])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

