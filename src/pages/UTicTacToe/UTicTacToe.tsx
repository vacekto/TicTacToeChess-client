import { useContext } from 'react'
import useGame from "@/util/useGame";
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/TicTacToeScore';
import InGameUsername from "@/components/InGameUsername";
import Switch from '@/components/Switch';
import CircleSVG from '@/components/icons/CircleSVG';
import CrossSVG from '@/components/icons/CrossSVG';
import reducer from './reducer'
import './UTicTacToe.scss'
import { context } from '@/util/globalContext/ContextProvider'
import {
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
        gameMode
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
        if (state.board[SX][SY][X][Y] || state.winner) return
        if (state.activeSegment) {
            const [A, B] = state.activeSegment
            if (A !== SX || B !== SY) return
        }
        gameInstance.move(SX, SY, X, Y)
        const stateUpdate = gameInstance.state
        console.log(stateUpdate)
        dispatch({
            type: 'STATE_UPDATE',
            payload: { state: stateUpdate }
        })
    }

    const renderIcon = (value: TTicTacToeSide | null | 'draw') => {
        if (value === 'O') return <CircleSVG />
        if (value === 'X') return <CrossSVG />
        return null
    }


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