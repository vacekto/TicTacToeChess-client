import { useContext, useEffect } from 'react'
import useGame from "@/util/useGame";
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/TicTacToeScore';
import InGameUsername from "@/components/InGameUsername";
import Switch from '@/components/Switch';
import CircleSVG from '@/util/svg/components/CircleSVG';
import CrossSVG from '@/util/svg/components/CrossSVG';
import reducer from './reducer'
import './UTicTacToe.scss'
import { context } from '@/context/GlobalStateProvider'
import { socketProxy } from '@/util/socketSingleton';
import {
    IUTicTacToeMove,
    IUTicTacToeState,
    TGameMode,
    TTicTacToeSide,
    UTicTacToeGame
} from 'shared';
import {
    useReducer,
} from 'react'

interface ITicTacToeProps {

}

const UTicTacToe: React.FC<ITicTacToeProps> = () => {
    const {
        username,
        opponentUsername,
        gameMode,
        gameSide,
        updateGlobalState,
    } = useContext(context)
    const { gameInstance } = useGame('uTicTacToe', gameMode as TGameMode) as { gameInstance: UTicTacToeGame }
    const [state, dispatch] = useReducer(reducer, {
        ...gameInstance.state,
        score: {
            X: 0,
            O: 0,
            draw: 0
        }
    })

    const resetCb = () => {
        gameInstance.resetState()
        const stateUpdate = gameInstance.state
        dispatch({ type: 'STATE_RESET', payload: { state: stateUpdate } })
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
        if (
            gameMode === 'multiplayer' &&
            state.activePlayer !== gameSide
        )
            return
        if (state.board[SX][SY][X][Y]) return
        if (state.winner) return
        if (state.activeSegment) {
            const [A, B] = state.activeSegment
            if (A !== SX || B !== SY) return
        }

        const move = { SX, SY, X, Y }
        gameInstance.move(move)
        if (gameMode === 'multiplayer')
            socketProxy.emit('game_move', move)
        const stateUpdate = gameInstance.state
        dispatch({ type: 'STATE_UPDATE', payload: { state: stateUpdate } })
    }

    const renderIcon = (value: TTicTacToeSide | null | 'draw') => {
        if (value === 'O') return <CircleSVG />
        if (value === 'X') return <CrossSVG />
        return null
    }

    useEffect(() => {

        socketProxy.on('game_state_update', (state, lastMove) => {
            gameInstance.move(lastMove as IUTicTacToeMove)
            dispatch({ type: 'STATE_UPDATE', payload: { state: state as IUTicTacToeState } })
        })

        socketProxy.on('leave_game', () => {
            updateGlobalState({
                gameName: '',
                gameMode: '',
                gameSide: '',
                opponentGameSide: '',
                opponentUsername: '',
            })
        })



        return () => {
            socketProxy.removeListener('game_state_update')
            socketProxy.removeListener('leave_game')
        }
    }, [])


    return <div className='UTicTacToe'>
        <InGameUsername username={username} opponentUsername={opponentUsername} />
        <InGameScore score={{ ...state.score }} />
        <div className="ultimateBoard">
            {state.board.map((ultimateRow, SX) => {
                return <div className='ultimateRow' key={SX}>
                    {ultimateRow.map((ultimateSquare, SY) => {
                        return <div
                            className={`ultimateSquare ${markActiveSegment(SX, SY)}`}
                            key={SY}>
                            {/*<div className='squareDone'>
                                <CircleSVG />
                    </div>*/}
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
        <Switch activePlayer={state.activePlayer} />
        <InGameOptions resetCb={resetCb} />
    </div>;
};

export default UTicTacToe;