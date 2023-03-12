import './App.scss';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext } from 'react'
import Menu from './pages/Menu';
import TicTacToe from './pages/TicTacToe/TicTacToe';
import UTicTacToe from './pages/UTicTacToe/UTicTacToe';
import { useEffect, useRef } from 'react';
import { registerDragToScroll, initUsernameFromStorage } from './util/functions'
import { context } from './util/globalContext/ContextProvider';
import Chess from './pages/Chess/Chess';
import UsernameModal from './components/UsernameModal'
import { IGlobalState } from './util/globalContext/reducer';

function App() {
  const appElement = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()
  const {
    theme,
    showUsernameModal,
    updateGlobalState,
    socketProxy,
    gameName,
  } = useContext(context)


  useEffect(() => {
    registerDragToScroll(appElement.current!)
    initUsernameFromStorage(updateGlobalState, socketProxy)

    socketProxy.on('setUsername', (status, message, username) => {
      console.log('message: ' + message)
      const stateUpdate: Partial<IGlobalState> = {}

      if (status === 'error') {
        stateUpdate.usernameErrorMsg = message
        stateUpdate.showUsernameModal = true
        stateUpdate.username = ''
      }
      else {
        stateUpdate.username = username
        stateUpdate.showUsernameModal = false
      }

      updateGlobalState(stateUpdate)
    })

    socketProxy.on('startGame', (gameName, opponentUsername, gameSide) => {

      const opponentGameSide = gameName === 'chess' ?
        (gameSide === 'w' ? 'b' : 'w') :
        (gameSide === 'O' ? 'X' : 'O')

      const stateUpdate: Partial<IGlobalState> = {
        gameName,
        opponentUsername,
        gameMode: 'multiplayer',
        opponentGameSide,
        gameSide
      }

      updateGlobalState(stateUpdate)
    })

  }, [])


  useEffect(() => {
    navigate(`/${gameName}`)
  }, [gameName])

  return (
    <div className="App" ref={appElement} id={theme}>
      <UsernameModal visible={showUsernameModal} />
      <Routes>
        <Route index element={<Menu />} />
        <Route path='/ticTacToe' element={<TicTacToe />} />
        <Route path='/uTicTacToe' element={<UTicTacToe />} />
        <Route path='/chess' element={<Chess />} />
      </Routes>
    </div>
  );
}

export default App;