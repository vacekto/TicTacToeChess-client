import './index.scss'
import { useState, CSSProperties, useContext, useEffect } from 'react'
import { context } from '@/util/Context'
import { useNavigate } from "react-router-dom";
import { TTicTacToeBoard, initializeTicTacToeBoard, TTicTacToeSide, checkForWinnerTicTacToe } from 'shared'
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/TicTacToeScore';
import Switch from '@/components/Switch';
import CircleSVG from '@/components/icons/CircleSVG';
import CrossSVG from '@/components/icons/CrossSVG';


interface ITicTacToeProps {

}

const TicTacToe: React.FC<ITicTacToeProps> = () => {

  const [boardState, setBoardState] = useState<TTicTacToeBoard>(initializeTicTacToeBoard(12))
  const [isPlaying, setIsPlaying] = useState<TTicTacToeSide>('O')
  const navigate = useNavigate();

  const { theme, setTheme } = useContext(context)

  const handleClick = (x: number, y: number) => () => {
    if (boardState[x][y]) return
    setBoardState(prevState => {
      prevState[x][y] = isPlaying
      console.log(checkForWinnerTicTacToe(prevState, [x, y], 5))
      return prevState
    })
    setIsPlaying(prevState => prevState === 'O' ? 'X' : 'O')
  }

  const renderIcon = (value: TTicTacToeSide | null) => {
    if (value === 'O') return <CircleSVG />
    if (value === 'X') return <CrossSVG />
    return null
  }

  const setSquareStyles = (x: number, y: number) => {
    const styles: CSSProperties = {}
    if (x === 0) styles.borderLeft = 'none'
    if (y === 0) styles.borderTop = 'none'
    return styles
  }

  const homeCb = () => { navigate('/') }
  const resetCb = () => { setBoardState(initializeTicTacToeBoard(9)) }
  const lightModeCb = () => { setTheme(theme === 'dark' ? 'light' : 'dark') }

  return <div className='TicTacToe'>
    <InGameScore game='TicTacToe' />
    <div className="board">
      {boardState.map((column, x) => <div key={x}>
        {column.map((square, y) => <div
          key={y}
          onClick={handleClick(x, y)}
          style={setSquareStyles(x, y)}
        >
          {renderIcon(square)}
        </div>
        )}
      </div>
      )}
    </div>
    <Switch isPlaying={isPlaying} />
    <InGameOptions homeCb={homeCb} resetCb={resetCb} lightModeCb={lightModeCb} />
    <div className="options">
    </div>
  </div>;
};

export default TicTacToe;