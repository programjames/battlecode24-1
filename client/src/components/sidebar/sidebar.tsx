import React from 'react'
import { BATTLECODE_YEAR } from '../../constants'
import { ThreeBarsIcon } from '../../icons/three-bars'
import { GamePage } from './game/game'
import { QueuePage } from './queue/queue'
import { BsChevronLeft } from 'react-icons/bs'
import { HelpPage } from './help/help'
import { MapEditorPage } from './map-editor/map-editor'
import { RunnerPage } from './runner/runner'
import { usePage, PageType, useSearchParamBool, useSearchParamString } from '../../app-search-params'
import { useKeyboard } from '../../util/keyboard'
import { Scrollbars } from 'react-custom-scrollbars-2'
import useWindowDimensions from '../../util/window-size'
import { TournamentPage } from './tournament/tournament'
import Tournament, { JsonTournamentGame } from '../../playback/Tournament'
import { useAppContext } from '../../app-context'
import { useScaffold } from './runner/scaffold'
import { ConfigPage } from '../../client-config'
import { UpdateWarning } from './update-warning'
import Game from '../../playback/Game'

export const Sidebar: React.FC = () => {
    const { width, height } = useWindowDimensions()
    const [page, setPage] = usePage()
    const context = useAppContext()
    const keyboard = useKeyboard()

    // scaffold is created at this level so it is never re-created
    const scaffold = useScaffold()

    const [open, setOpen] = useSearchParamBool('sidebarOpen', true)

    const minWidth = open ? 'min-w-[390px]' : 'min-w-[64px]'
    const maxWidth = open ? 'max-w-[390px]' : 'max-w-[64px]'

    // Tournament mode loading ====================================================================================================
    const [tournamentMode, setTournamentMode] = useSearchParamBool('tournament', false)
    const [loadingRemoteTournament, setLoadingRemoteTournament] = React.useState(false)
    const [tournamentSource, setTournamentSource] = useSearchParamString('tournamentSource', '')
    const fetchTournamentPage = (tournamentSource: string, rawGames: JsonTournamentGame[]) => {
        fetch(tournamentSource)
            .then((response) => response.text())
            .then((text) => {
                const data = JSON.parse(text)
                const newGames = data.results as JsonTournamentGame[]
                rawGames.push(...newGames)

                if (data.next) {
                    fetchTournamentPage(data.next, rawGames)
                } else {
                    setLoadingRemoteTournament(false)
                    console.log(rawGames)
                    context.setState({
                        ...context.state,
                        tournament: new Tournament(rawGames)
                    })
                }
            })
    }
    React.useEffect(() => {
        if (tournamentSource) {
            setLoadingRemoteTournament(true)
            fetchTournamentPage(tournamentSource, [])
            setPage(PageType.TOURNAMENT)
        }
    }, [tournamentSource])
    // End tournament mode loading ====================================================================================================

    // Remote game loading ====================================================================================================
    const [gameSource, setGameSource] = useSearchParamString('gameSource', '')
    const fetchRemoteGame = (gameSource: string) => {
        fetch(gameSource)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                if (buffer.byteLength === 0) {
                    alert('Error: Game file is empty.')
                    return
                }

                const loadedGame = Game.loadFullGameRaw(buffer)
                context.setState({
                    ...context.state,
                    activeGame: loadedGame,
                    activeMatch: loadedGame.currentMatch,
                    queue: context.state.queue.concat([loadedGame]),
                    loadingRemoteContent: false
                })

                setPage(PageType.GAME)
            })
    }
    React.useEffect(() => {
        if (gameSource) {
            context.setState({
                ...context.state,
                loadingRemoteContent: true
            })
            fetchRemoteGame(gameSource)
            setPage(PageType.GAME)
        }
    }, [gameSource])
    // End remote game loading ====================================================================================================

    // Skip going through map and help tab, it's annoying for competitors.
    const hotkeyPageLoop = tournamentMode
        ? [PageType.GAME, PageType.QUEUE, PageType.TOURNAMENT]
        : [PageType.GAME, PageType.QUEUE, PageType.RUNNER]
    const getNextPage = (currentPage: PageType, previous: boolean) => {
        const index = hotkeyPageLoop.indexOf(currentPage)
        if (index === -1) return currentPage
        const nextIndex = (index + (previous ? -1 : 1) + hotkeyPageLoop.length) % hotkeyPageLoop.length
        return hotkeyPageLoop[nextIndex]
    }

    React.useEffect(() => {
        if (context.state.disableHotkeys) return

        if (keyboard.keyCode === 'Backquote') setPage(getNextPage(page, true))
        if (keyboard.keyCode === 'Digit1') setPage(getNextPage(page, false))

        //if (keyboard.keyCode === 'ShiftLeft') setPage(PageType.QUEUE)
    }, [keyboard.keyCode])

    const activeSidebarButtons = React.useMemo(() => {
        if (tournamentMode) {
            return [
                { name: 'Game', page: PageType.GAME },
                { name: 'Queue', page: PageType.QUEUE },
                { name: 'Tournament', page: PageType.TOURNAMENT }
            ]
        }
        return [
            { name: 'Game', page: PageType.GAME },
            { name: 'Queue', page: PageType.QUEUE },
            { name: 'Runner', page: PageType.RUNNER },
            { name: 'Map Editor', page: PageType.MAP_EDITOR },
            { name: 'Help', page: PageType.HELP },
            { name: 'Config', page: PageType.CONFIG }
        ]
    }, [tournamentMode])

    return (
        <div
            className={`${minWidth} ${maxWidth} bg-light text-black h-screen transition-[min-width,max-width] overflow-hidden`}
        >
            <Scrollbars
                universal={true}
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                autoHeight
                autoHeightMax={height}
                autoHeightMin={height}
            >
                <div className="flex flex-col gap-2 p-3 h-screen">
                    <div className="flex justify-between items-center">
                        {open && (
                            <p className="px-2 whitespace-nowrap font-extrabold text-xl">{`BATTLECODE ${BATTLECODE_YEAR}`}</p>
                        )}
                        <div className="flex">
                            <button
                                onClick={() => setOpen(!open)}
                                className="p-1 hover:bg-lightHighlight rounded-md"
                                style={{
                                    width: '30px',
                                    height: '30px'
                                }}
                            >
                                {open ? <BsChevronLeft className="mx-auto font-bold stroke-2" /> : <ThreeBarsIcon />}
                            </button>
                        </div>
                    </div>
                    {open && (
                        <>
                            <UpdateWarning />
                            <div className="flex flex-row flex-wrap justify-between mb-2">
                                {activeSidebarButtons.map((sidebarButton) => (
                                    <div
                                        key={sidebarButton.page}
                                        className={
                                            'w-[32%] text-center text-sm py-2 my-1 cursor-pointer hover:bg-lightHighlight border-b-2 ' +
                                            (page == sidebarButton.page ? 'border-gray-800' : 'border-gray-200')
                                        }
                                        onClick={() => setPage(sidebarButton.page)}
                                    >
                                        {sidebarButton.name}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <GamePage open={open && page == PageType.GAME} />
                    <QueuePage open={open && page == PageType.QUEUE} />
                    <RunnerPage open={open && page == PageType.RUNNER} scaffold={scaffold} />
                    <MapEditorPage open={open && page == PageType.MAP_EDITOR} />
                    <HelpPage open={open && page == PageType.HELP} />
                    <ConfigPage open={open && page == PageType.CONFIG} />
                    <TournamentPage
                        open={open && page == PageType.TOURNAMENT}
                        loadingRemoteTournament={loadingRemoteTournament}
                    />
                </div>
            </Scrollbars>
        </div>
    )
}
