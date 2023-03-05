import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from 'react'
import Menu from './pages/Menu';
import TicTacToe from './pages/TicTacToe/TicTacToe';
import UTicTacToe from './pages/UTicTacToe/UTicTacToe';
import { useEffect, useRef } from 'react';
import registerDragToScroll from './util/functions/dragToScroll'
import { context } from './util/context/ContextProvider';
import Chess from './pages/Chess/Chess';
import UsernameModal from './components/UsernameModal'

function App() {
  const appElement = useRef<HTMLDivElement | null>(null);
  const {
    theme,
    showUsernameModal,
    setUsername
  } = useContext(context)

  useEffect(() => {
    registerDragToScroll(appElement.current!)

    const name = localStorage.getItem('username');
    if (name) {
      setUsername(name, true)
    }
  }, [])

  return (
    <div className="App" ref={appElement} id={theme}>
      <UsernameModal visible={showUsernameModal} />
      <BrowserRouter>
        <Routes>
          <Route index element={<Menu />} />
          <Route path='/TicTacToe' element={<TicTacToe />} />
          <Route path='/UTicTacToe' element={<UTicTacToe />} />
          <Route path='/Chess' element={<Chess />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;