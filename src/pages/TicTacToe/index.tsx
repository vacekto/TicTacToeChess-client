import './index.scss'
import { useState, CSSProperties, useContext } from 'react'
import { context } from '@/util/Context'
import { useNavigate } from "react-router-dom";
import { TTicTacToeState, initializeTicTacToeState, TTicTacToeSide } from 'shared'
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/InGameScore';
import Switch from '@/components/Switch';
import CircleSVG from '@/components/svg/CircleSVG';
import CrossSVG from '@/components/svg/CrossSVG';


interface ITicTacToeProps {

}

const TicTacToe: React.FC<ITicTacToeProps> = () => {

  const [boardState, setBoardState] = useState<TTicTacToeState>(initializeTicTacToeState(12))
  const [isPlaying, setIsPlaying] = useState<TTicTacToeSide>('O')
  const navigate = useNavigate();

  const { theme, setTheme } = useContext(context)

  const handleClick = (x: number, y: number) => () => {
    if (boardState[y][x]) return
    setBoardState(prevState => {
      prevState[y][x] = isPlaying
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
  const resetCb = () => { setBoardState(initializeTicTacToeState(9)) }
  const lightModeCb = () => { setTheme(theme === 'dark' ? 'light' : 'dark') }



  return <div className='TicTacToe'>
    <InGameScore game='TicTacToe' />
    <div className="board">
      {boardState.map((row, y) => <div key={y}>
        {row.map((square, x) => <div
          key={x}
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