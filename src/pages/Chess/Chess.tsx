import './Chess.scss'
import { useReducer, useContext, useEffect } from 'react';
import useGame from '@/util/useGame'
import { ChessGame, IChessMove, IChessState, TChessPiece, TGameMode } from 'shared';
import InGameOptions from '@/components/InGameOptions';
import InGameUsername from '@/components/InGameUsername';
import { context } from '@/context/GlobalStateProvider'
import ChessHistory from './ChessHistory';
import SVG from '../../util/svg/components/ChessPieces'
import reducer from './reducer'
import { socketProxy } from '@/util/socketSingleton';
import { v4 as uuidv4 } from 'uuid';

const Chess: React.FC = () => {
    const {
        username,
        opponentUsername,
        gameMode,
        gameSide,
        updateGlobalState
    } = useContext(context)
    const { gameInstance } = useGame('chess', gameMode as TGameMode) as { gameInstance: ChessGame }
    const [state, dispatch] = useReducer(reducer, {
        ...gameInstance.state,
        selected: null,
        potentialMoves: []
    })

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
        const SE = state.selected
        for (let [A, B] of state.potentialMoves) {
            if (
                gameMode === 'multiplayer' &&
                state.activePlayer !== gameSide
            )
                break
            if (A === X && B === Y) {
                const move = {
                    from: {
                        X: SE![0],
                        Y: SE![1]
                    },
                    to: { X, Y }
                }
                gameInstance.move(move)
                if (gameMode === 'multiplayer')
                    socketProxy.emit('game_move', move)
                const stateUpdate = gameInstance.state
                dispatch({
                    type: 'STATE_UPDATE',
                    payload: { state: stateUpdate }
                })
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


    const sortFn = ((figureA: TChessPiece, figureB: TChessPiece) => {
        const sortValues = {
            p: 1,
            n: 2,
            b: 3,
            r: 4,
            q: 5
        }

        const a = figureA[1] as keyof typeof sortValues
        const b = figureB[1] as keyof typeof sortValues

        if (sortValues[a] < sortValues[b]) return 1
        if (sortValues[a] > sortValues[b]) return -1
        return 0
    })

    useEffect(() => {

        socketProxy.on('game_state_update', (state, lastMove) => {
            gameInstance.move(lastMove as IChessMove)
            dispatch({ type: 'STATE_UPDATE', payload: { state: state as IChessState } })
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



    return <div className='Chess'>
        <InGameUsername username={username} opponentUsername={opponentUsername} />

        <div className="boardContainer">

            <div className="piecesTakenWhite">
                {state.figuresTaken.w.sort(sortFn).map(piece => {
                    return <div
                        className='pieceTaken'
                        key={uuidv4()}>
                        {SVG[piece]}
                    </div>
                })}
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
            <div className="piecesTakenBlack">
                {state.figuresTaken.b.sort(sortFn).map(piece => {
                    return <div
                        className='pieceTaken'
                        key={uuidv4()}>
                        {SVG[piece]}
                    </div>
                })}
            </div>
        </div>


        <InGameOptions resetCb={resetCb} />
        {state.winner ?
            <ChessHistory
                backwardCb={backwardCb}
                forwardCb={forwardCb}
                fastBackwardCb={fastBackwardCb}
                fastForwardCb={fastForwardCb}
            /> :
            null
        }
    </div>;
};

export default Chess;