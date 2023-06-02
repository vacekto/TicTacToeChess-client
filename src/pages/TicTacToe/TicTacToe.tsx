import './TicTacToe.scss'
import { useReducer, useContext, useEffect } from 'react'
import { context } from '@/context/GlobalStateProvider'
import { TTicTacToeSide, ITicTacToeState, suggestTicTacToeMove, ITicTacToeAIMoveProps, ITicTacToeMove } from 'shared'
import InGameOptions from '@/components/InGameOptions';
import InGameScore from '@/components/InGameScore';
import InGameUsername from '@/components/InGameUsername'
import Switch from '@/components/Switch';
import CircleSVG from '@/util/svg/components/CircleSVG';
import CrossSVG from '@/util/svg/components/CrossSVG';
import { socketProxy } from '@/util/socketSingleton';
import reducer from './reducer'
import useTicTacToe from './useTicTacToe'
import SelectSideModal from '@/components/modals/SelectSideModal';
import Winner from '@/components/Winner'
import { IGlobalState } from '@/context/globalReducer';
const worker = new Worker(new URL('./ticTacToeWorker.ts', import.meta.url))

interface ITicTacToeProps {

}

const TicTacToe: React.FC<ITicTacToeProps> = () => {
  const {
    username,
    gameMode,
    opponentUsername,
    gameSide,
    updateGlobalState,
    leaveGame,
    ticTacToeWinCondition,
    startingSide
  } = useContext(context)


  const gameInstance = useTicTacToe()

  const [state, dispatch] = useReducer(reducer, {
    ...gameInstance.state,
    score: {
      X: 0,
      O: 0,
      draw: 0
    }
  })

  const handleClick = (X: number, Y: number) => () => {

    if (
      state.board[X][Y] ||
      state.winner ||
      state.activePlayer !== gameSide
    )
      return

    const move = { X, Y }

    gameInstance.move(move)
    const stateUpdate = gameInstance.state

    dispatch({
      type: 'STATE_UPDATE',
      payload: { state: stateUpdate }
    })


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
    const newStartingSide = startingSide === 'O' ? 'X' : 'O'
    gameInstance.resetState(newStartingSide)
    const stateUpdate = gameInstance.state
    dispatch({ type: 'STATE_UPDATE', payload: { state: stateUpdate } })
    const globalStateUpdate: Partial<IGlobalState> = {}
    globalStateUpdate.startingSide = newStartingSide
    if (gameMode === 'hotseat')
      globalStateUpdate.gameSide = newStartingSide
    updateGlobalState(globalStateUpdate)
  }

  useEffect(() => {
    if (
      state.activePlayer === gameSide ||
      gameMode !== 'vsPC' ||
      state.winner
    )
      return

    // const move = suggestTicTacToeMove({
    //   board: gameInstance.state.board,
    //   activePlayer: gameInstance.state.activePlayer,
    //   winCondition: ticTacToeWinCondition,
    //   skill: 3
    // }
    // )

    // gameInstance.move(move)

    worker.postMessage({
      board: gameInstance.state.board,
      activePlayer: gameInstance.state.activePlayer,
      winCondition: ticTacToeWinCondition,
      skill: 3
    })


    // const newState = gameInstance.state
    // dispatch({ type: 'STATE_UPDATE', payload: { state: newState } })

  }, [state.activePlayer])

  useEffect(() => {

    worker.onmessage = (msg) => {
      const move = msg.data as ITicTacToeMove
      gameInstance.move(move)
      const newState = gameInstance.state
      dispatch({ type: 'STATE_UPDATE', payload: { state: newState } })
    }

    updateGlobalState({
      startingSide: gameInstance.state.activePlayer
    })

    if (gameMode !== 'multiplayer') return

    socketProxy.on('game_state_update', (state) => {
      gameInstance.updateState(state as ITicTacToeState)
      dispatch({ type: 'STATE_UPDATE', payload: { state: state as ITicTacToeState } })
    })

    socketProxy.on('leave_game', leaveGame)

    return () => {
      socketProxy.removeListener('game_state_update')
      socketProxy.removeListener('leave_game')
    }
  }, [])

  const test = () => {
    // const gameState = {
    //   board: gameInstance.state.board,
    //   activePlayer: gameInstance.state.activePlayer,
    //   winCondition: ticTacToeWinCondition,
    //   difficulty: 3
    // }
    // fetch('http://localhost:3001', {
    //   method: 'POST',
    //   body: JSON.stringify(gameState)
    // })

    worker.postMessage({
      board: gameInstance.state.board,
      activePlayer: gameInstance.state.activePlayer,
      winCondition: ticTacToeWinCondition,
      skill: 3
    })

  }

  return <div className='TicTacToe'>
    <SelectSideModal />
    <InGameUsername username={username} opponentUsername={opponentUsername} />
    <InGameScore score={state.score} />
    <button onClick={test}>test</button>
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

    {gameInstance.winner ?
      <Winner
        winner={gameInstance.winner}
        resetCb={resetCb}
      /> :
      <>
        <Switch activePlayer={state.activePlayer} />
        <InGameOptions resetCb={resetCb} />
      </>
    }

    <div className="options">
    </div>
  </div>;
};

export default TicTacToe;