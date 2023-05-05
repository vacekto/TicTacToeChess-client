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
import useChessInstance from './useChessInstance'

import ChessPiece from '@/util/svg/components/ChessPiece'

interface IDragData {
    elementRef: SVGSVGElement
    mouseStart: [number, number]
    currentSquare: [number, number]
}


const Chess: React.FC = () => {
    const {
        username,
        opponentUsername,
        updateGlobalState
    } = useContext(context)
    const [flipped, setFlipped] = useState<boolean>(false)
    const gameInstance = useChessInstance()
    const [dragData, setDragData] = useState<IDragData | null>(null)
    const [state, dispatch] = useReducer(reducer, {
        ...gameInstance.state,
        selected: null,
        potentialMoves: []
    })

    const isInPotentialMoves = (X: number, Y: number) => {
        let outcome = false

        for (const [A, B] of state.potentialMoves) {
            if (X === A && Y === B) {
                outcome = true
                break
            }
        }

        return outcome
    }

    const setSquareStyleClass = (X: number, Y: number) => {
        let className = ''
        const SE = state.selected

        const i = flipped ? 1 : 0

        if ((X + Y) % 2 === i) className += 'even '
        if (SE && SE[0] === X && SE[1] === Y) className += 'active '
        state.potentialMoves.forEach(([A, B]) => {
            if (A === X && B === Y) className += 'potentialMove '
        })
        return className
    }

    const resetCb = () => {
        gameInstance.resetGame()
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


    const sortPieces = ((pieceA: TChessPiece, pieceB: TChessPiece) => {
        const sortValues = {
            p: 1,
            n: 2,
            b: 3,
            r: 4,
            q: 5
        }

        const a = pieceA[1] as keyof typeof sortValues
        const b = pieceB[1] as keyof typeof sortValues

        if (sortValues[a] < sortValues[b]) return 1
        if (sortValues[a] > sortValues[b]) return -1
        return 0
    })

    const handleMouseMove = (X: number, Y: number) => (e: MouseEvent) => {
        if (!dragData) return


        const mouseDiffX = e.clientY - dragData.mouseStart[1]
        const mouseDiffY = e.clientX - dragData.mouseStart[0]
        dragData.elementRef.style.top = mouseDiffX + 'px'
        dragData.elementRef.style.left = mouseDiffY + 'px'
        dragData.elementRef.style.zIndex = '1'

        const isOutOfBounds = (X: number, Y: number) => {
            return (
                0 >= X &&
                X >= 7 &&
                0 >= Y &&
                Y >= 7
            )
        }

        const i = flipped ? -1 : 1
        const squareDiffX = Math.floor((mouseDiffX + i * 25) / (i * 50))
        const squareDiffY = Math.floor((mouseDiffY + 25) / 50)

        const newSquareX = X + squareDiffX
        const newSquareY = Y + squareDiffY

        if (isOutOfBounds(newSquareX, newSquareY)) {
            dragData.elementRef.style.left = '0'
            dragData.elementRef.style.top = '0'
            dragData.elementRef.style.zIndex = '0'
            setDragData(null)
            return
        }

        if (
            newSquareX === dragData.currentSquare[0] &&
            newSquareY === dragData.currentSquare[1]
        )
            return

        setDragData(prevState => {
            const update = { ...prevState! }
            update.currentSquare = [newSquareX, newSquareY]
            return update
        })
    }

    const handleMouseDown = (X: number, Y: number) => (e: MouseEvent) => {
        const squareElement = document.getElementById(`square${X}${Y}`)
        const svgElement = squareElement?.children[0] as SVGSVGElement | undefined
        const boardPiece = state.board[X][Y]
        const clickedSide = boardPiece[0]

        if (
            isInPotentialMoves(X, Y) &&
            state.selected
        ) {

            const [A, B] = state.selected
            const from = [A, B]
            const to = [X, Y]
            const move = { from, to } as IChessMove

            gameInstance.move(move)

            const stateUpdate = gameInstance.state

            dispatch({
                type: 'STATE_UPDATE',
                payload: { state: stateUpdate }
            })

            return
        }

        if (
            boardPiece === 'ee' ||
            state.activePlayer !== clickedSide
        ) {
            dispatch({ type: 'DESELECT' })
            return
        }


        const legalMoves = gameInstance.getLegalMoves([X, Y])

        dispatch({
            type: 'SELECT',
            payload: { coord: [X, Y], potentialMoves: legalMoves }
        })

        setDragData({
            elementRef: svgElement!,
            currentSquare: [X, Y],
            mouseStart: [e.clientX, e.clientY]
        })
    }


    const handleMouseUp = (X: number, Y: number) => () => {
        if (dragData) {
            dragData.elementRef.style.left = '0'
            dragData.elementRef.style.top = '0'
            dragData.elementRef.style.zIndex = '0'
        }

        if (dragData?.currentSquare && state.selected) {
            const [A, B] = dragData.currentSquare
            if (isInPotentialMoves(A, B)) {
                const from = [X, Y]
                const to = [A, B]
                const move = { from, to } as IChessMove
                gameInstance.move(move)
                const state = gameInstance.state
                dispatch({
                    type: 'STATE_UPDATE',
                    payload: { state }
                })
            }
        }

        setDragData(null)
    }


    const setPiece = (X: number, Y: number) => {
        let piece: TChessPiece = state.board[X][Y]

        if (
            piece === 'ee' &&
            isInPotentialMoves(X, Y) &&
            dragData?.currentSquare[0] === X &&
            dragData?.currentSquare[1] === Y &&
            state.selected
        ) {
            const [A, B] = state.selected
            piece = state.board[A][B]
        }

        return piece

    }

    const setDragOpacity = (X: number, Y: number) => {
        const style: React.CSSProperties = {}
        if (
            isInPotentialMoves(X, Y) &&
            dragData?.currentSquare[0] === X &&
            dragData?.currentSquare[1] === Y
        )
            style.opacity = '0.5'
        return style
    }

    const flip = () => {
        setFlipped(prevState => prevState ? false : true)
    }

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

        <button onClick={flip}>flip</button>

        <div className="boardContainer">

            <div className="piecesTakenWhite">
                {state.figuresTaken.w.sort(sortPieces).map((piece, index) => {
                    return <div
                        className='pieceTaken'
                        key={index}
                    >
                        <ChessPiece
                            piece={piece}
                        />
                    </div>
                })}
            </div>
            <div className={`board ${flipped ? 'flipped' : ''}`}>

                {state.board.map((row, X) => {
                    return <div className='row' key={X}>

                        {row.map((_, Y) => {

                            return <div
                                key={Y}
                                className={`square ${setSquareStyleClass(X, Y)}`}
                                id={`square${X}${Y}`}
                                onMouseMove={handleMouseMove(X, Y)}
                                onMouseDown={handleMouseDown(X, Y)}
                                onMouseUp={handleMouseUp(X, Y)}
                            >
                                <ChessPiece
                                    piece={setPiece(X, Y)}
                                    style={setDragOpacity(X, Y)}
                                />
                            </div>
                        })}
                    </div>
                })}
            </div>
            <div className="piecesTakenBlack">
                {state.figuresTaken.b.sort(sortPieces).map(piece => {
                    return <div
                        className='pieceTaken'
                        key={uuidv4()}
                    >
                        <ChessPiece piece={piece} />
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