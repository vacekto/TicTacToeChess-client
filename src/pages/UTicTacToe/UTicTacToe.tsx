import { useContext, useEffect } from 'react'
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/InGameScore';
import InGameUsername from "@/components/InGameUsername";
import Switch from '@/components/Switch';
import CircleSVG from '@/util/svg/components/CircleSVG';
import CrossSVG from '@/util/svg/components/CrossSVG';
import reducer from './reducer'
import './UTicTacToe.scss'
import { context } from '@/context/GlobalStateProvider'
import { socketProxy } from '@/util/socketSingleton';
import SelectSideModal from '@/components/modals/SelectSideModal';
import Winner from '@/components/Winner';
import {
    IUTicTacToeMove,
    IUTicTacToeState,
    TTicTacToeSide,
} from 'shared';
import useUTicTacToe from './useUTicTacToe';
import {
    useReducer,
} from 'react'
import { IGlobalState } from '@/context/globalReducer';
const worker = new Worker(new URL('./uTicTacToeWorker.ts', import.meta.url))

interface ITicTacToeProps {

}

const UTicTacToe: React.FC<ITicTacToeProps> = () => {
    const {
        username,
        opponentUsername,
        gameSide,
        leaveGame,
        gameMode,
        updateGlobalState,
        startingSide
    } = useContext(context)


    const gameInstance = useUTicTacToe()

    const [state, dispatch] = useReducer(reducer, {
        ...gameInstance.state,
        score: {
            X: 0,
            O: 0,
            draw: 0
        }
    })

    const renderSquareDone = (SX: number, SY: number) => {
        const segmentStatus = state.segmentBoard[SX][SY]

        if (segmentStatus === 'O') return (
            <div className={`squareDone ` + 'circle'}>
                <CircleSVG />
            </div>
        )
        if (segmentStatus === 'X') return (
            <div className={`squareDone ` + 'cross'}>
                <CrossSVG />
            </div>
        )

        return null
    }

    const resetCb = () => {
        gameInstance.resetState(startingSide === 'O' ? 'X' : 'O')
        const stateUpdate = gameInstance.state
        dispatch({ type: 'STATE_RESET', payload: { state: stateUpdate } })

        const globalStateUpdate: Partial<IGlobalState> = {}
        globalStateUpdate.startingSide = startingSide === 'O' ? 'X' : 'O'
        if (gameMode === 'hotseat')
            globalStateUpdate.gameSide = startingSide === 'O' ? 'X' : 'O'
        updateGlobalState(globalStateUpdate)
    }

    const setSquareStyleClass = (X: number, Y: number) => {
        let className = ''
        if (X === 0) className += 'noBorderTop '
        if (Y === 0) className += 'noBorderLeft '
        return className
    }

    const markActiveSegment = (SX: number, SY: number) => {
        if (state.activeSegment) {
            const [A, B] = state.activeSegment
            if (A === SX && B === SY) return 'active'
        }
        return ''
    }



    const handleClick = (
        SX: number, SY: number, X: number, Y: number
    ) => () => {
        if (state.activePlayer !== gameSide) return
        if (state.board[SX][SY][X][Y]) return
        if (state.winner) return
        if (state.activeSegment) {
            const [A, B] = state.activeSegment
            if (A !== SX || B !== SY) return
        }

        const move = { SX, SY, X, Y }
        gameInstance.move(move)
        const stateUpdate = gameInstance.state
        dispatch({ type: 'STATE_UPDATE', payload: { state: stateUpdate } })
    }

    const renderIcon = (value: TTicTacToeSide | null | 'draw') => {
        if (value === 'O') return <CircleSVG />
        if (value === 'X') return <CrossSVG />
        return null
    }

    useEffect(() => {
        if (
            gameMode !== 'vsPC' ||
            gameSide === state.activePlayer ||
            state.winner
        )
            return

        worker.postMessage({
            board: state.board,
            activeSegment: state.activeSegment,
            activePlayer: state.activePlayer,
            segmentBoard: state.segmentBoard
        })

    }, [state.activePlayer])

    useEffect(() => {

        worker.onmessage = (msg) => {
            const move = msg.data as IUTicTacToeMove
            gameInstance.move(move)
            const newState = gameInstance.state
            dispatch({ type: 'STATE_UPDATE', payload: { state: newState } })
        }

        updateGlobalState({
            startingSide: gameInstance.state.activePlayer
        })


        socketProxy.on('game_state_update', (state) => {
            gameInstance.updateState(state as IUTicTacToeState)
            dispatch({ type: 'STATE_UPDATE', payload: { state: state as IUTicTacToeState } })
        })

        socketProxy.on('leave_game', leaveGame)

        return () => {
            socketProxy.removeListener('game_state_update')
            socketProxy.removeListener('leave_game')
        }
    }, [])


    return <div className='UTicTacToe'>
        <SelectSideModal />
        <InGameUsername username={username} opponentUsername={opponentUsername} />
        <InGameScore score={{ ...state.score }} />
        <div className="ultimateBoard">
            {state.board.map((ultimateRow, SX) => {
                return <div className='ultimateRow' key={SX}>
                    {ultimateRow.map((ultimateSquare, SY) => {
                        return <div
                            className={`ultimateSquare ${markActiveSegment(SX, SY)}`}
                            key={SY}>
                            {renderSquareDone(SX, SY)}
                            {ultimateSquare.map((row, X) => {
                                return <div className='row' key={X}>
                                    {row.map((square, Y) => {
                                        return <div
                                            className={`square ${setSquareStyleClass(X, Y)}`}
                                            key={Y}
                                            onClick={handleClick(SX, SY, X, Y)}
                                        >
                                            {renderIcon(square)}
                                        </div>
                                    })}
                                </div>
                            })}
                        </div>
                    })}
                </div>
            })}
        </div>
        {gameInstance.winner ?
            <Winner
                winner={gameInstance.winner}
                resetCb={resetCb}
            /> :
            <>
                <Switch activePlayer={state.activePlayer} />
                <InGameOptions resetCb={resetCb} />
            </>
        }
    </div>;
};

export default UTicTacToe;