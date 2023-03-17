import './App.scss';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext } from 'react'
import Menu from './pages/Menu/Menu';
import TicTacToe from './pages/TicTacToe/TicTacToe';
import UTicTacToe from './pages/UTicTacToe/UTicTacToe';
import { useEffect, useRef } from 'react';
import { context } from './util/globalContext/ContextProvider';
import Chess from './pages/Chess/Chess';
import UsernameModal from './components/UsernameModal'
import {
  registerDragToScroll,
  subscribeToSocketEvents
} from './util/functions'

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
    subscribeToSocketEvents(updateGlobalState, socketProxy)
  }, [])

  useEffect(() => {
    navigate(`/${gameName}`)
  }, [gameName])

  const test = () => {
    socketProxy.emit('test')


    // fetch('http://localhost:3001/setUsername',
    //   {
    //     method: 'POST',
    //     body: 'some username'
    //   }
    // ).then(response => console.log(response.status))
  }

  const connect = () => {
    socketProxy.connect('testing')
  }

  const disconnect = () => {
    socketProxy.disconnect()
  }

  return (
    <div className="App" ref={appElement} id={theme}>
      <button onClick={test}>test</button>
      <button onClick={connect}>connect</button>
      <button onClick={disconnect}>disconnect</button>
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