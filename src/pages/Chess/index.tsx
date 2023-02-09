import './index.scss'
import { initializeChessBoard, TChessState } from 'shared';
import { CSSProperties, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import blackBishop from '@/util/svg/BlackBishop.svg'
import { context } from '@/util/Context'

import InGameOptions from '@/components/InGameOptions';
import ChessHistory from './ChessHistory';


const Chess: React.FC = () => {
    const [boardState, setBoardState] = useState<TChessState>(initializeChessBoard())
    const navigate = useNavigate();
    const { theme, setTheme } = useContext(context)


    const setSquareStyles = (x: number, y: number) => {
        const styles: CSSProperties = {}
        if (x === 0) styles.borderLeft = 'none'
        if (y === 0) styles.borderTop = 'none'
        if ((x + y) % 2 === 0) styles.background = '#8ea5ad'
        else styles.background = '#ebefee'
        return styles
    }

    const homeCb = () => { navigate('/') }
    const resetCb = () => { setBoardState(initializeChessBoard()) }
    const lightModeCb = () => { setTheme(theme === 'dark' ? 'light' : 'dark') }


    return <div className='Chess'>
        <div className="figuresTaken">
            <div className="player1"><img src={blackBishop} alt="" /></div>
            <div className="player2">right</div>
        </div>
        <div className="board">
            {boardState.map((row, y) => {
                return <div className='row' key={y}>
                    {row.map((square, x) => {
                        return <div
                            className='square'
                            key={x}
                            style={setSquareStyles(x, y)}
                        >
                            <img src={blackBishop} alt="" />

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