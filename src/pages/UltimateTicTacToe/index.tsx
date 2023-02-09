import './index.scss'
import { initializeUltimateTicTacToeState, TUltimateTicTacToeState, TTicTacToeSide } from 'shared';
import { useState, useContext, CSSProperties, useEffect } from 'react'
import { context } from '@/util/Context'
import { useNavigate } from "react-router-dom";
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/TicTacToeScore';
import Switch from '@/components/Switch';
import CircleSVG from '@/components/icons/CircleSVG';
import CrossSVG from '@/components/icons/CrossSVG';

interface IUltimateTicTacToeProps {

}

const UltimateTicTacToe: React.FC<IUltimateTicTacToeProps> = () => {
    const [boardState, setBoardState] = useState<TUltimateTicTacToeState>(initializeUltimateTicTacToeState())
    const [isPlaying, setIsPlaying] = useState<TTicTacToeSide>('O')
    const navigate = useNavigate();
    const { theme, setTheme } = useContext(context)

    const homeCb = () => { navigate('/') }
    const resetCb = () => { setBoardState(initializeUltimateTicTacToeState()) }
    const lightModeCb = () => { setTheme(theme === 'dark' ? 'light' : 'dark') }

    const setSquareStyles = (x: number, y: number) => {
        const styles: CSSProperties = {}
        if (x === 0) styles.borderLeft = 'none'
        if (y === 0) styles.borderTop = 'none'
        return styles
    }

    const handleClick = (x: number, y: number, uX: number, uY: number) => () => {
        if (boardState[uY][uX][y][x]) return
        setBoardState(prevState => {
            prevState[uY][uX][y][x] = isPlaying
            return prevState
        })
        setIsPlaying(prevState => prevState === 'O' ? 'X' : 'O')
    }

    const renderIcon = (value: TTicTacToeSide | null) => {
        if (value === 'O') return <CircleSVG />
        if (value === 'X') return <CrossSVG />
        return null
    }

    return <div className='UltimateTicTacToe'>
        <InGameScore game='UltimateTicTacToe' />
        <div className="ultimateBoard">
            {boardState.map((ultimateRow, uY) => {
                return <div className='ultimateRow' key={uY}>
                    {ultimateRow.map((ultimateSquare, uX) => {
                        return <div className='ultimateSquare' key={uX}>
                            {/*<div className='squareDone'>
                                <CircleSVG />
                    </div>*/}
                            {ultimateSquare.map((row, y) => {
                                return <div className='row' key={y}>
                                    {row.map((square, x) => {
                                        return <div
                                            className='square'
                                            key={x}
                                            style={setSquareStyles(x, y)}
                                            onClick={handleClick(x, y, uX, uY)}
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
        <Switch isPlaying={isPlaying} />
        <InGameOptions homeCb={homeCb} resetCb={resetCb} lightModeCb={lightModeCb} />
    </div>;
};

export default UltimateTicTacToe;