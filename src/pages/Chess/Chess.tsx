import './Chess.scss'
import { useReducer, useContext, useEffect, MouseEvent, useRef, useState } from 'react';
import { ChessGame, IChessMove, IChessState, TChessPiece } from 'shared';
import InGameOptions from '@/components/InGameOptions';
import InGameUsername from '@/components/InGameUsername';
import { context } from '@/context/GlobalStateProvider'
import ChessHistory from './ChessHistory';
import reducer from './reducer'
import { socketProxy } from '@/util/socketSingleton';
import { v4 as uuidv4 } from 'uuid';

import ChessPiece from '@/util/svg/components/ChessPiece'

const Chess: React.FC = () => {
    const {
        username,
        opponentUsername,
        gameMode,
        gameSide,
        updateGlobalState
    } = useContext(context)


    const gameInstance = useRef(new ChessGame()).current

    const movingPiece = useRef<SVGSVGElement | null>(null)
    const dragStartPos = useRef<[number, number] | null>(null)
    const [dragCurrentPos, setDragCurrentPos] = useState<[number, number] | null>(null)

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


    const test = (X: number, Y: number) => () => {
        console.log('hahaha')
    }


    const handleMouseMove = (X: number, Y: number) => (e: MouseEvent) => {
        if (!movingPiece.current || !dragStartPos.current || !dragCurrentPos) return
        const diffX = dragStartPos.current[0] - e.clientX
        const diffY = e.clientY - dragStartPos.current[1]
        movingPiece.current.style.right = diffX + 'px'
        movingPiece.current.style.top = diffY + 'px'
        movingPiece.current.style.zIndex = '1'
        if (X === dragCurrentPos[0] && Y === dragCurrentPos[1]) return
        setDragCurrentPos([X, Y])
    }

    const handleMouseDown = (X: number, Y: number) => (e: MouseEvent) => {
        const square = document.getElementById(`square${X}${Y}`)
        const svg = square?.children[0] as SVGSVGElement | undefined
        if (!svg) return
        setDragCurrentPos([X, Y])
        movingPiece.current = svg
        dragStartPos.current = [e.clientX, e.clientY]
    }

    const handleMouseUp = () => {
        if (movingPiece.current && dragStartPos.current) {
            movingPiece.current.style.right = '0'
            movingPiece.current.style.top = '0'
            movingPiece.current.style.zIndex = '0'
        }
        movingPiece.current = null
        dragStartPos.current = null
        setDragCurrentPos(null)
    }



    const setChessPieceStyle = (X: number, Y: number) => {
        const style: React.CSSProperties = {}
        if (
            dragCurrentPos &&
            dragCurrentPos[0] === X &&
            dragCurrentPos[1] === Y &&
            state.board[X][Y] === 'ee'
        )


            style.opacity = '0'
        return style
    }

    return <div className='Chess'>
        <InGameUsername username={username} opponentUsername={opponentUsername} />
        <div className="boardContainer">

            <div className="piecesTakenWhite">
                {state.figuresTaken.w.sort(sortFn).map((piece, index) => {
                    return <div
                        className='pieceTaken'
                        key={index}
                    >
                        <img src='test.svg' alt="" />
                    </div>
                })}
            </div>

            <div className="board">

                {state.board.map((row, X) => {
                    return <div className='row' key={X}>

                        {row.map((piece, Y) => {
                            if (
                                piece === 'ee' &&
                                dragCurrentPos &&
                                dragCurrentPos[0] === X &&
                                dragCurrentPos[1] === Y
                            ) {

                            }


                            return <div
                                key={Y}
                                className={`square ${setSquareStyleClass(X, Y)}`}
                                id={`square${X}${Y}`}
                                onClick={handleSquareClick(X, Y)}
                                onMouseMove={handleMouseMove(X, Y)}
                                // onClick={test(X, Y)}
                                onMouseDown={handleMouseDown(X, Y)}
                                onMouseUp={handleMouseUp}
                            >
                                <ChessPiece
                                    piece={piece}
                                    style={setChessPieceStyle(X, Y)}
                                />
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