import './index.scss'
import {
    TTicTacToeSide,
    initUTicTacToeState
} from 'shared';
import {
    useContext,
    CSSProperties,
    useReducer,
} from 'react'
import { context } from '@/util/Context'
import { useNavigate } from "react-router-dom";
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/TicTacToeScore';
import Switch from '@/components/Switch';
import CircleSVG from '@/components/icons/CircleSVG';
import CrossSVG from '@/components/icons/CrossSVG';
import reducer from './reducer'

interface ITicTacToeProps {

}

const UTicTacToe: React.FC<ITicTacToeProps> = () => {
    const [state, dispatch] = useReducer(reducer, initUTicTacToeState())
    const navigate = useNavigate();
    const { theme, setTheme } = useContext(context)

    const homeCb = () => { navigate('/') }
    const resetCb = () => { dispatch({ type: 'RESET_STATE' }) }
    const lightModeCb = () => { setTheme(theme === 'dark' ? 'light' : 'dark') }

    const setSquareStyles = (X: number, Y: number) => {
        const styles: CSSProperties = {}
        if (X === 0) styles.borderTop = 'none'
        if (Y === 0) styles.borderLeft = 'none'
        return styles
    }

    const setActiveSegment = (SX: number, SY: number) => {
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
        dispatch({
            type: 'HOTSEAT_MOVE',
            payload: { moveCOORD: [SX, SY, X, Y] }
        })
    }

    const renderIcon = (value: TTicTacToeSide | null | 'draw') => {
        if (value === 'O') return <CircleSVG />
        if (value === 'X') return <CrossSVG />
        return null
    }

    return <div className='UTicTacToe'>
        <InGameScore score={{ ...state.score }} />
        <div className="ultimateBoard">
            {state.board.map((ultimateRow, SX) => {
                return <div className='ultimateRow' key={SX}>
                    {ultimateRow.map((ultimateSquare, SY) => {
                        return <div
                            className={`ultimateSquare ${setActiveSegment(SX, SY)}`}
                            key={SY}>
                            {/*<div className='squareDone'>
                                <CircleSVG />
                    </div>*/}
                            {ultimateSquare.map((row, X) => {
                                return <div className='row' key={X}>
                                    {row.map((square, Y) => {
                                        return <div
                                            className='square'
                                            key={Y}
                                            style={setSquareStyles(X, Y)}
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
        <InGameOptions homeCb={homeCb} resetCb={resetCb} lightModeCb={lightModeCb} />
    </div>;
};

export default UTicTacToe;