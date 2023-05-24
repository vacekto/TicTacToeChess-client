import './App.scss';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext } from 'react'
import Menu from './pages/Menu/Menu';
import TicTacToe from './pages/TicTacToe/TicTacToe';
import UTicTacToe from './pages/UTicTacToe/UTicTacToe';
import { useEffect } from 'react';
import { context } from './context/GlobalStateProvider';
import Chess from './pages/Chess/Chess';
import UsernameModal from './components/modals/UsernameModal'
import {
  registerDragToScroll,
  subscribeToSocketEvents,
} from './util/functions'
import { socketProxy } from '@/util/socketSingleton'
import InvitationNotificationss from './components/InvitationNotifications';
import { getMoveSuggestion } from 'shared';

function App() {
  const navigate = useNavigate()
  const {
    theme,
    updateGlobalState,
    gameName,
    handleNewInvite,
  } = useContext(context)


  useEffect(() => {
    registerDragToScroll()
    subscribeToSocketEvents(socketProxy, updateGlobalState, handleNewInvite)

    socketProxy.emit('fetch_online_users')

    return () => {
      socketProxy.removeAllListeners()
    }

  }, [])

  useEffect(() => {
    navigate(`/${gameName}`)
  }, [gameName])

  const test = () => {
    const board = [[null, null, null], [null, null, null], [null, null, null]]
    const activePlayer = 'O'

    getMoveSuggestion(board, activePlayer)
  }

  return (
    <div className="App" id={theme}>
      <InvitationNotificationss />
      <UsernameModal />
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