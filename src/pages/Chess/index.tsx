import './index.scss'
import { useContext, useReducer, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { context } from '@/util/Context'
import { ChessGame, IChessState } from 'shared';
import InGameOptions from '@/components/InGameOptions';
import ChessHistory from './ChessHistory';
import SVG from './icons'
import reducer, { IReducerState } from './reducer'

const Chess: React.FC = () => {
    const { theme, setTheme, gameRef } = useContext(context)
    const [state, dispatch] = useReducer(reducer, {} as IReducerState)
    const navigate = useNavigate();


    const setStyleClasses = (X: number, Y: number) => {
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

        for (let i = 0; i < state.potentialMoves.length; i++) {
            const [A, B] = state.potentialMoves[i]
            if (A === X && B === Y) {
                gameRef.current!.move([SE![0], SE![1]], [X, Y])
                const state = gameRef.current!.state
                dispatch({ type: 'MOVE', payload: { state } })
                return
            }
        }

        if (SE && SE[0] === X && SE[1] === Y) {
            dispatch({ type: 'DESELECT' })
            return
        }

        let moves: [number, number][] = []
        if (state.board[X][Y] !== 'ee') {
            moves = gameRef.current!.getPotentialMoves([X, Y])
        }

        dispatch({
            type: 'SELECT',
            payload: {
                coord: [X, Y],
                potentialMoves: moves
            },
        })
    }

    const homeCb = () => { navigate('/') }
    const resetCb = () => {
        gameRef.current!.resetState()
        const state = gameRef.current!.state as IChessState
        dispatch({
            type: 'INIT_STATE',
            payload: { state }
        })
    }
    const lightModeCb = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    useEffect(() => {
        gameRef.current = new ChessGame('black')
        dispatch({
            type: 'INIT_STATE',
            payload: { state: gameRef.current.state }
        })
        return () => {
            gameRef.current = null
        }
    }, [])

    const test = () => {

    }

    return <div className='Chess'>
        <button onClick={test}>test</button>
        <div className="figuresTaken">
            <div className='player1'>
                <img src={SVG.bk} alt="" />

            </div>
            <div className='player2'>
                <img src={SVG.wr} alt="" />
            </div>
        </div>
        <div className="board">
            {state.board === undefined ? null : state.board.map((row, X) => {
                return <div className='row' key={X}>
                    {row.map((square, Y) => {
                        return <div
                            className={`square ${setStyleClasses(X, Y)}`}
                            key={Y}
                            onClick={handleSquareClick(X, Y)}
                        >
                            {square ? <img src={SVG[square]} alt="" /> : null}
                        </div>
                    })}
                </div>
            })}
        </div>
        <InGameOptions homeCb={homeCb} resetCb={resetCb} lightModeCb={lightModeCb} />
        <ChessHistory />
    </div>;
};

export default Chess;