import './Chess.scss'
import { useReducer, useContext, useEffect, MouseEvent, useState } from 'react';
import { IChessMove, IChessState, TChessPiece } from 'shared';
import InGameOptions from '@/components/InGameOptions';
import InGameUsername from '@/components/InGameUsername';
import { context } from '@/context/GlobalStateProvider'
import ChessHistory from './ChessHistory';
import reducer from './reducer'
import { socketProxy } from '@/util/socketSingleton';
import { v4 as uuidv4 } from 'uuid';
import SelectSideModal from '@/components/modals/SelectSideModal';
import ChessPiece from '@/util/svg/components/ChessPiece'
import useChess from './useChess';
import Winner from '@/components/Winner';

interface IDragData {
    elementRef: SVGSVGElement
    mouseStart: [number, number]
    currentSquare: [number, number]
}


const Chess: React.FC = () => {
    const {
        username,
        gameMode,
        gameSide,
        opponentUsername,
        updateGlobalState,
        leaveGame
    } = useContext(context)

    const gameInstance = useChess()
    const [flipped, setFlipped] = useState<boolean>(false)
    const [showLastMove, setShowLastMove] = useState<boolean>(true)
    const [dragData, setDragData] = useState<IDragData | null>(null)
    const [state, dispatch] = useReducer(reducer, {
        ...gameInstance.state,
        selected: null,
        potentialMoves: []
    })

    const isInPotentialMoves = (X: number, Y: number) => {
        for (const [A, B] of state.potentialMoves) {
            if (X === A && Y === B) return true
        }
        return false
    }

    const setSquareStyleClass = (X: number, Y: number) => {
        let className = ''
        const SE = state.selected
        const LM = state.lastMove
        const i = flipped ? 1 : 0

        if ((X + Y) % 2 === i) className += 'even '
        if (SE && SE[0] === X && SE[1] === Y) className += 'active '
        state.potentialMoves.forEach(([A, B]) => {
            if (A === X && B === Y) className += 'potentialMove '
        })

        if (!LM || !showLastMove) return className
        if (LM.from[0] === X && LM.from[1] === Y) className += 'lastMove '
        if (LM.to[0] === X && LM.to[1] === Y) className += 'lastMove '

        return className
    }

    const resetCb = () => {
        gameInstance.resetState()
        const state = gameInstance.state as IChessState
        updateGlobalState({
            gameSide: 'w'
        })
        dispatch({
            type: 'STATE_UPDATE',
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

        const i = flipped ? -1 : 1
        const squareDiffX = Math.floor((mouseDiffX + i * 25) / (i * 50))
        const squareDiffY = Math.floor((mouseDiffY + 25) / 50)

        const newSquareX = X + squareDiffX
        const newSquareY = Y + squareDiffY

        const isOutOfBounds = (X: number, Y: number) => {
            return (
                0 > X || 7 < X ||
                0 > Y || 7 < Y
            )
        }

        const isCurrentSquare = (X: number, Y: number) => {
            return (
                X === dragData.currentSquare[0] &&
                Y === dragData.currentSquare[1]
            )

        }

        if (isOutOfBounds(newSquareX, newSquareY)) {
            dragData.elementRef.style.left = '0'
            dragData.elementRef.style.top = '0'
            dragData.elementRef.style.zIndex = '0'
            setDragData(null)
            return
        }

        if (isCurrentSquare(newSquareX, newSquareY))
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
            const move: IChessMove = {
                from: [A, B],
                to: [X, Y]
            }

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
            gameSide !== clickedSide
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

    const displayLastMove = () => {
        setShowLastMove(prevState => prevState ? false : true)
    }

    useEffect(() => {

        socketProxy.on('game_state_update', (state) => {
            gameInstance.updateState(state as IChessState, true)
            dispatch({ type: 'STATE_UPDATE', payload: { state: state as IChessState } })
        })

        socketProxy.on('new_game', resetCb)
        socketProxy.on('leave_game', leaveGame)


        return () => {
            socketProxy.removeListener('game_state_update')
            socketProxy.removeListener('leave_game')
            socketProxy.removeListener('new_game')
        }

    }, [])

    return <div className='Chess'>
        <SelectSideModal />
        <InGameUsername username={username} opponentUsername={opponentUsername} />
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
        <div className="displayOptions">
            <button className='customButton' onClick={flip}>Flip board</button>
            <button className='customButton' onClick={displayLastMove} >{`${showLastMove ? 'Hide' : 'Display'} last move`}</button>
        </div>

        {state.winner ?
            <>
                <Winner
                    winner={state.winner}
                    resetCb={resetCb} />
                <ChessHistory
                    backwardCb={backwardCb}
                    forwardCb={forwardCb}
                    fastBackwardCb={fastBackwardCb}
                    fastForwardCb={fastForwardCb}
                />
            </> :
            <InGameOptions resetCb={resetCb} />
        }
    </div>;
};

export default Chess;