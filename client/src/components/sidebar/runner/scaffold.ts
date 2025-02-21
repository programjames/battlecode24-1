import { useEffect, useRef, useState } from 'react'
import { BATTLECODE_YEAR, ENGINE_BUILTIN_MAP_NAMES } from '../../../constants'
import { NativeAPI, nativeAPI } from './native-api-wrapper'
import { ConsoleLine } from './runner'
import { useForceUpdate } from '../../../util/react-util'
import WebSocketListener from './websocket'
import { useAppContext } from '../../../app-context'

export type JavaInstall = {
    display: string
    path: string
}

type Scaffold = [
    setup: boolean,
    availableMaps: Set<string>,
    availablePlayers: Set<string>,
    javaInstalls: JavaInstall[],
    manuallySetupScaffold: () => Promise<void>,
    reloadData: () => void,
    scaffoldLoading: boolean,
    runMatch: (javaPath: string, teamA: string, teamB: string, selectedMaps: Set<string>) => Promise<void>,
    killMatch: (() => Promise<void>) | undefined,
    console: ConsoleLine[]
]

export function useScaffold(): Scaffold {
    const appContext = useAppContext()
    const [javaInstalls, setJavaInstalls] = useState<JavaInstall[]>([])
    const [availableMaps, setAvailableMaps] = useState<Set<string>>(new Set())
    const [availablePlayers, setAvailablePlayers] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState<boolean>(true)
    const [scaffoldPath, setScaffoldPath] = useState<string | undefined>(undefined)
    const matchPID = useRef<string | undefined>(undefined)
    const forceUpdate = useForceUpdate()
    const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([])
    const log = (line: ConsoleLine) =>
        setConsoleLines((prev) => (prev.length > 10000 ? [...prev.slice(1), line] : [...prev, line]))

    const [webSocketListener, setWebSocketListener] = useState<WebSocketListener | undefined>()

    async function manuallySetupScaffold() {
        if (!nativeAPI) return
        setLoading(true)
        const path = await nativeAPI.openScaffoldDirectory()
        setLoading(false)
        if (path) setScaffoldPath(path)
    }

    async function runMatch(javaPath: string, teamA: string, teamB: string, selectedMaps: Set<string>): Promise<void> {
        if (matchPID.current || !scaffoldPath) return
        setConsoleLines([])
        const newPID = await dispatchMatch(javaPath, teamA, teamB, selectedMaps, nativeAPI!, scaffoldPath!)
        matchPID.current = newPID
        forceUpdate()
    }

    async function killMatch(): Promise<void> {
        if (!matchPID.current) return
        await nativeAPI!.child_process.kill(matchPID.current)
        matchPID.current = undefined
        forceUpdate()
    }

    function reloadData() {
        if (!nativeAPI || !scaffoldPath) return
        setLoading(true)

        const dataPromise = fetchData(scaffoldPath)
        const javasPromise = nativeAPI.getJavas()
        Promise.allSettled([dataPromise, javasPromise]).then((res) => {
            if (res[0].status == 'fulfilled') {
                const [players, maps] = res[0].value
                setAvailablePlayers(players)
                setAvailableMaps(maps)
            }
            if (res[1].status == 'fulfilled') {
                const data = res[1].value
                const installs: JavaInstall[] = []
                for (let i = 0; i < data.length; i += 2) {
                    installs.push({
                        display: data[i],
                        path: data[i + 1]
                    })
                }
                setJavaInstalls(installs)
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        if (!nativeAPI) {
            setLoading(false)
            return
        }

        findDefaultScaffoldPath(nativeAPI).then((path) => {
            setLoading(false)
            setScaffoldPath(path)
        })

        nativeAPI.child_process.onStdout(({ pid, data }) => {
            if (pid !== matchPID.current) return
            log({ content: data, type: 'output' })
        })
        nativeAPI.child_process.onStderr(({ pid, data }) => {
            if (pid !== matchPID.current) return
            log({ content: data, type: 'error' })
        })
        nativeAPI.child_process.onExit(({ pid, code, signal }) => {
            if (pid !== matchPID.current) return
            log({ content: `Exited with code ${code} | ${JSON.stringify(signal)}`, type: 'bold' })
            matchPID.current = undefined
            forceUpdate()
        })

        setWebSocketListener(
            new WebSocketListener((game) => {
                game.currentMatch = game.matches[0]
                appContext.setState({
                    ...appContext.state,
                    queue: appContext.state.queue.concat([game]),
                    activeGame: game,
                    activeMatch: game.currentMatch
                })
            })
        )
    }, [])

    useEffect(() => {
        reloadData()
    }, [scaffoldPath])

    return [
        !!scaffoldPath,
        availableMaps,
        availablePlayers,
        javaInstalls,
        manuallySetupScaffold,
        reloadData,
        loading,
        runMatch,
        matchPID.current ? killMatch : undefined,
        consoleLines
    ]
}

async function fetchData(scaffoldPath: string) {
    const path = nativeAPI!.path
    const fs = nativeAPI!.fs

    const mapPath = await path.join(scaffoldPath, 'maps')
    if (!(await fs.exists(mapPath))) await fs.mkdir(mapPath)

    let sourcePath = await path.join(scaffoldPath, 'src')
    if (!(await fs.exists(sourcePath))) {
        // For running in the main battlecode folder
        sourcePath = await path.join(scaffoldPath, 'example-bots', 'src', 'main')

        if (!(await fs.exists(sourcePath))) {
            throw new Error(`Can't find source path: ${sourcePath}`)
        }
    }

    const playerFiles = await fs.getFiles(sourcePath, 'true')
    const sep = await path.getSeperator()
    const players = new Set(
        await Promise.all(
            playerFiles
                .filter(
                    (file) =>
                        file.endsWith('RobotPlayer.java') ||
                        file.endsWith('RobotPlayer.kt') ||
                        file.endsWith('RobotPlayer.scala')
                )
                .map(async (file) => {
                    // Relative path will contain the folder and filename, so we can split on the separator
                    // to get the folder name. We must first normalize the path to have forward slashes in the
                    // case of windows so the relative path function works correctly
                    const p1 = sourcePath.replace(/\\/g, '/')
                    const p2 = file.replace(/\\/g, '/')
                    const relPath = (await path.relative(p1, p2)).replace(/\\/g, '/')
                    const botName = relPath.split('/')[0]
                    return botName
                })
        )
    )

    const mapExtension = '.map' + (BATTLECODE_YEAR % 100)
    const mapFiles = await fs.getFiles(mapPath)
    const maps = new Set(
        mapFiles
            .filter((file) => file.endsWith(mapExtension))
            .map((file) => file.substring(0, file.length - mapExtension.length))
            .map((file) => file.split(sep)[file.split(sep).length - 1])
            .concat(Array.from(ENGINE_BUILTIN_MAP_NAMES))
    )

    localStorage.setItem('scaffoldPath', scaffoldPath)

    return [players, maps]
}

async function findDefaultScaffoldPath(nativeAPI: NativeAPI): Promise<string | undefined> {
    const localPath = localStorage.getItem('scaffoldPath')
    if (localPath) return localPath

    const appPath = await nativeAPI.getRootPath()
    const path = nativeAPI.path
    const fs = nativeAPI.fs

    // scaffold/client/Battlecode Client[.exe]
    const fromWin = await path.dirname(await path.dirname(appPath))
    // scaffold/client/resources/app.asar
    const from3 = await path.dirname(await path.dirname(await path.dirname(appPath)))
    // scaffold/Battlecode Client.app/Contents/Resources/app.asar
    const fromMac = await path.dirname(
        await path.dirname(await path.dirname(await path.dirname(await path.dirname(appPath))))
    )

    if (await fs.exists(from3)) {
        return from3
    } else if (await fs.exists(fromWin)) {
        return fromWin
    } else if (await fs.exists(fromMac)) {
        return fromMac
    }

    return undefined
}

async function dispatchMatch(
    javaPath: string,
    teamA: string,
    teamB: string,
    selectedMaps: Set<string>,
    nativeAPI: NativeAPI,
    scaffoldPath: string
): Promise<string> {
    const options = [
        `run`,
        `-x`,
        `unpackClient`,
        `-PwaitForClient=true`,
        `-PteamA=${teamA}`,
        `-PteamB=${teamB}`,
        `-Pmaps=${[...selectedMaps].join(',')}`,
        `-PvalidateMaps=false`,
        `-PenableProfiler=${false}`
    ]

    return await nativeAPI.child_process.spawn(scaffoldPath, javaPath, options)
}
