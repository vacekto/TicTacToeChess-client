import './Chess.scss'
import { useReducer, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useGame from '@/util/useGame'
import { ChessGame, IChessState, TGameMode } from 'shared';
import InGameOptions from '@/components/InGameOptions';
import InGameUsername from '@/components/InGameUsername';
import { context } from '@/util/globalContext/ContextProvider'
import ChessHistory from './ChessHistory';
import SVG from './icons/ChessPiece'
import reducer from './reducer'

const Chess: React.FC = () => {
    const {
        username,
        opponentUsername,
        switchLightTheme,
        gameMode,
        gameSide,
        socketProxy
    } = useContext(context)
    const { gameInstance } = useGame('chess', gameMode as TGameMode) as { gameInstance: ChessGame }
    const [state, dispatch] = useReducer(reducer, {
        ...gameInstance.state,
        selected: null,
        potentialMoves: []
    })
    const navigate = useNavigate();

    const setSquareStyleClass = (X: number, Y: number) => {
        let className = ''
        const SE = state.selected
        if (X === 0) className += 'noBorderTop '
        if (Y === 0) className += 'noBorderLeft '
        if ((X + Y) % 2 === 0) className += 'even '
        if (SE && SE[0] === X && SE[1] === Y) className += 'active '
        state.potentialMoves.forEach(([A, B]) => {
            if (A === X && B === Y) className += 'potentialMove '
        })
        return className
    }

    const handleSquareClick = (X: number, Y: number) => () => {
        const [SE, AP] = [state.selected, state.activePlayer]

        for (let [A, B] of state.potentialMoves) {
            if (A === X && B === Y) {
                if (SE && state.board[SE[0]][SE[1]][0] !== AP[0]) {
                    dispatch({ type: 'DESELECT' })
                    return
                }
                gameInstance.move([SE![0], SE![1]], [X, Y])
                const stateUpdate = gameInstance.state
                dispatch({ type: 'STATE_UPDATE', payload: { state: stateUpdate } })
                return
            }
        }

        if (SE && SE[0] === X && SE[1] === Y) {
            dispatch({ type: 'DESELECT' })
            return
        }

        let moves = gameInstance.getLegalMoves([X, Y])

        dispatch({
            type: 'SELECT',
            payload: {
                coord: [X, Y],
                potentialMoves: moves
            },
        })
    }

    const resetCb = () => {
        gameInstance.resetState()
        const state = gameInstance.state as IChessState
        dispatch({
            type: 'RESET_STATE',
            payload: { state }
        })
    }

    const forwardCb = () => {
        gameInstance.forward()
        const state = gameInstance.state
        dispatch({ type: 'STATE_UPDATE', payload: { state } })
    }

    const backwardCb = () => {
        gameInstance.backward()
        const state = gameInstance.state
        dispatch({ type: 'STATE_UPDATE', payload: { state } })
    }

    const fastBackwardCb = () => {
        gameInstance.fastBackward()
        const state = gameInstance.state
        dispatch({ type: 'STATE_UPDATE', payload: { state } })

    }

    const fastForwardCb = () => {
        gameInstance.fastForward()
        const state = gameInstance.state
        dispatch({ type: 'STATE_UPDATE', payload: { state } })

    }

    useEffect(() => {
        socketProxy.on('gameStateUpdate', () => {
            //update state 
        })
    }, [])


    return <div className='Chess'>
        <InGameUsername username={username} opponentUsername={opponentUsername} />

        <div className="figuresTaken">
            <div className='player1'>
                {state.figuresTaken.w.map((piece, index) => {
                    return SVG[piece]
                })}
            </div>
            <div className='player2'>
                {state.figuresTaken.b.map((piece, index) => {
                    return SVG[piece]
                })}
            </div>
        </div>
        <div className="board">
            {state.board.map((row, X) => {
                return <div className='row' key={X}>
                    {row.map((piece, Y) => {
                        return <div
                            className={`square ${setSquareStyleClass(X, Y)}`}
                            key={Y}
                            onClick={handleSquareClick(X, Y)}
                        >
                            {SVG[piece]}
                        </div>
                    })}
                </div>
            })}
        </div>
        <InGameOptions resetCb={resetCb} />
        <ChessHistory
            backwardCb={backwardCb}
            forwardCb={forwardCb}
            fastBackwardCb={fastBackwardCb}
            fastForwardCb={fastForwardCb}
        />
    </div>;
};

export default Chess;