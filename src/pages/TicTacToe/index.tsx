import './index.scss'
import { CSSProperties, useContext, useReducer } from 'react'
import { context } from '@/util/Context'
import { useNavigate } from "react-router-dom";
import { TTicTacToeSide, initTicTacToeState } from 'shared'
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/TicTacToeScore';
import Switch from '@/components/Switch';
import CircleSVG from '@/components/icons/CircleSVG';
import CrossSVG from '@/components/icons/CrossSVG';
import reducer from './reducer'

interface ITicTacToeProps {

}

const TicTacToe: React.FC<ITicTacToeProps> = () => {
  const [state, dispatch] = useReducer(reducer, initTicTacToeState())
  const { theme, setTheme } = useContext(context)
  const navigate = useNavigate();

  const handleClick = (X: number, Y: number) => () => {
    if (state.board[X][Y] || state.winner) return
    dispatch({ type: 'HOTSEAT_MOVE', payload: { moveCOORD: [X, Y] } })
  }

  const renderIcon = (value: TTicTacToeSide | null | 'draw') => {
    if (value === 'O') return <CircleSVG />
    if (value === 'X') return <CrossSVG />
    return null
  }

  const setSquareStyles = (x: number, y: number) => {
    const styles: CSSProperties = {}
    if (x === 0) styles.borderTop = 'none'
    if (y === 0) styles.borderLeft = 'none'
    return styles
  }

  const homeCb = () => { navigate('/') }
  const resetCb = () => { dispatch({ type: 'RESET_STATE' }) }
  const lightModeCb = () => { setTheme(theme === 'dark' ? 'light' : 'dark') }

  return <div className='TicTacToe'>
    <InGameScore score={state.score} />
    <div className="board">
      {state.board.map((row, X) => <div key={X}>
        {row.map((square, Y) => <div
          key={Y}
          onClick={handleClick(X, Y)}
          style={setSquareStyles(X, Y)}
        >
          {renderIcon(square)}
        </div>
        )}
      </div>
      )}
    </div>
    <Switch activePlayer={state.activePlayer} />
    <InGameOptions homeCb={homeCb} resetCb={resetCb} lightModeCb={lightModeCb} />
    <div className="options">
    </div>
  </div>;
};

export default TicTacToe;