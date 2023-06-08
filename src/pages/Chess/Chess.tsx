import './Chess.scss'
import { useReducer, useContext, useEffect, MouseEvent, useState, useRef } from 'react';
import { IChessMove, IChessState, TChessPiece, TGameSide } from 'shared';
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
const jsChessEngine = require('js-chess-engine')
const worker = new Worker(new URL('./chessWorker.ts', import.meta.url))

interface IDragData {
    elementRef: SVGSVGElement
    mouseStart: [number, number]
    currentSquare: [number, number]
}

const Chess: React.FC = () => {
    const {
        username,
        gameSide,
        opponentUsername,
        updateGlobalState,
        leaveGame,
        gameMode,
        startingSide
    } = useContext(context)

    const gameInstance = useChess()
    const vsPCInstance = useRef(new jsChessEngine.Game())

    const [flipped, setFlipped] = useState<boolean>(false)
    const [showLastMove, setShowLastMove] = useState<boolean>(true)
    const [dragData, setDragData] = useState<IDragData | null>(null)
    const [state, dispatch] = useReducer(reducer, {
        ...gameInstance.state,
        selected: null,
        potentialMoves: []
    })


    const PCMove = () => {

        const fen = gameInstance.getFEN()
        worker.postMessage(fen)

        // setTimeout(() => {



        //     const playedMove = vsPCInstance.current.aiMove(3)
        //     const fromConventional = Object.keys(playedMove)[0]
        //     const from = convertCoord.conventionalToNumeric(fromConventional)
        //     const to = convertCoord.conventionalToNumeric(playedMove[fromConventional])
        //     const move: IChessMove = { from, to }
        //     gameInstance.move(move)
        //     const newState = gameInstance.state
        //     dispatch({
        //         type: 'STATE_UPDATE',
        //         payload: { state: newState }
        //     })
        // }, 500);
    }


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
        vsPCInstance.current = new jsChessEngine.Game()

        const state = gameInstance.state as IChessState
        let side: TGameSide = 'w'
        if (gameMode === 'vsPC')
            side = startingSide === 'b' ? 'w' : 'b'

        updateGlobalState({
            gameSide: side,
            startingSide: side
        })

        dispatch({ type: 'STATE_UPDATE', payload: { state } })
        if (side === 'b' && gameMode === 'vsPC')
            PCMove()
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


    const convertCoord = (() => {
        const boardLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

        return {
            numericToConventional: ([X, Y]: [number, number]) => {
                return (boardLetters[Y] + String(7 - X + 1))
            },

            conventionalToNumeric: (pos: string) => {
                return [7 - (+pos[1] - 1), boardLetters.indexOf(pos[0])] as [number, number]
            }

        }
    })()

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

            if (gameMode === 'vsPC') {
                const from = convertCoord.numericToConventional(move.from)
                const to = convertCoord.numericToConventional(move.to)
                vsPCInstance.current.move(from, to)
            }

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
                const move = { from: [X, Y], to: [A, B] } as IChessMove
                gameInstance.move(move)
                if (gameMode === 'vsPC') {
                    const from = convertCoord.numericToConventional(move.from)
                    const to = convertCoord.numericToConventional(move.to)
                    vsPCInstance.current.move(from, to)
                }
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
        if (
            gameMode !== 'vsPC' ||
            gameSide === state.activePlayer ||
            state.winner
        )
            return

        const fen = gameInstance.getFEN()
        worker.postMessage(fen)

    }, [state.activePlayer])

    useEffect(() => {

        worker.onmessage = (msg) => {
            const playedMoveInConv = msg.data as { [key: string]: string }
            const fromConventional = Object.keys(playedMoveInConv)[0]
            const toConventional = playedMoveInConv[fromConventional]
            const fromNumeric = convertCoord.conventionalToNumeric(fromConventional)
            const toNumeric = convertCoord.conventionalToNumeric(toConventional)
            const move: IChessMove = { from: fromNumeric, to: toNumeric }
            gameInstance.move(move)
            vsPCInstance.current.move(fromConventional, toConventional)
            const newState = gameInstance.state
            dispatch({
                type: 'STATE_UPDATE',
                payload: { state: newState }
            })
        }



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


    const test = () => {
        const fen = gameInstance.getFEN()
        console.log(fen)
    }

    return <div className='Chess'>
        <SelectSideModal />
        <InGameUsername username={username} opponentUsername={opponentUsername} />
        <button onClick={test}>test</button>
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