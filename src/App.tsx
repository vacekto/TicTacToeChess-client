import './App.scss';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext } from 'react'
import Menu from './pages/Menu/Menu';
import TicTacToe from './pages/TicTacToe/TicTacToe';
import UTicTacToe from './pages/UTicTacToe/UTicTacToe';
import { useEffect, useRef, useState } from 'react';
import { context } from './util/globalContext/ContextProvider';
import Chess from './pages/Chess/Chess';
import UsernameModal from './components/UsernameModal'
import { registerDragToScroll, subscribeToSocketEvents } from './util/functions'
import socketSingleton, { socketProxy } from '@/util/socketSingleton'


function App() {
  const appElement = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()
  const {
    theme,
    showUsernameModal,
    updateGlobalState,
    gameName,
    username
  } = useContext(context)


  useEffect(() => {
    registerDragToScroll(appElement.current!)
    subscribeToSocketEvents(updateGlobalState, socketProxy)
    socketProxy.on('disconnect', () => {
      navigate('/')
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