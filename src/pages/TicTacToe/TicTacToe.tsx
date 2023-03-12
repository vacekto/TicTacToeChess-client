import './TicTacToe.scss'
import { useReducer, useContext } from 'react'
import { context } from '@/util/globalContext/ContextProvider'
import useGame from '@/util/useGame'
import { TTicTacToeSide, TicTacToeGame, TGameMode } from 'shared'
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/TicTacToeScore';
import InGameUsername from '@/components/InGameUsername'
import Switch from '@/components/Switch';
import CircleSVG from '@/components/icons/CircleSVG';
import CrossSVG from '@/components/icons/CrossSVG';
import reducer from './reducer'

interface ITicTacToeProps {

}

const TicTacToe: React.FC<ITicTacToeProps> = () => {
  const {
    username,
    opponentUsername,
    gameMode
  } = useContext(context)
  const { gameInstance } = useGame('ticTacToe', gameMode as TGameMode) as { gameInstance: TicTacToeGame }
  const [state, dispatch] = useReducer(reducer, {
    ...gameInstance.state,
    score: {
      X: 0,
      O: 0,
      draw: 0
    }
  })

  const handleClick = (X: number, Y: number) => () => {
    if (state.board[X][Y] || state.winner) return
    gameInstance.move([X, Y])
    const stateUpdate = gameInstance.state
    dispatch({ type: 'STATE_UPDATE', payload: { state: stateUpdate } })
  }

  const renderIcon = (value: TTicTacToeSide | null | 'draw') => {
    if (value === 'O') return <CircleSVG />
    if (value === 'X') return <CrossSVG />
    return null
  }

  const setSquareStyleClass = (X: number, Y: number) => {
    let className = ''
    if (X === 0) className += 'noBorderTop '
    if (Y === 0) className += 'noBorderLeft '
    return className
  }

  const resetCb = () => {
    gameInstance.resetState()
    const stateUpdate = gameInstance.state
    dispatch({ type: 'STATE_UPDATE', payload: { state: stateUpdate } })
  }


  return <div className='TicTacToe'>
    <InGameUsername username={username} opponentUsername={opponentUsername} />
    <InGameScore score={state.score} />
    <div className="board">
      {state.board.map((row, X) => <div key={X}>
        {row.map((square, Y) => <div
          key={Y}
          onClick={handleClick(X, Y)}
          className={setSquareStyleClass(X, Y)}
        >
          {renderIcon(square)}
        </div>
        )}
      </div>
      )}
    </div>
    <Switch activePlayer={state.activePlayer} />
    <InGameOptions resetCb={resetCb} />
    <div className="options">
    </div>
  </div>;
};

export default TicTacToe;