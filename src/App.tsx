import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from 'react'
import Menu from './pages/Menu';
import TicTacToe from './pages/TicTacToe';
import UltimateTicTacToe from './pages/UltimateTicTacToe';
import { useEffect, useRef } from 'react';
import registerDragToScroll from './util/functions/dragToScroll'
import { context } from './util/Context';

function App() {
  const appElement = useRef<HTMLDivElement | null>(null);
  const { theme } = useContext(context)

  useEffect(() => {
    registerDragToScroll(appElement.current!)
  }, [])

  return (
    <div className="App" ref={appElement} id={theme}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Menu />} />
          <Route path='/TicTacToe' element={<TicTacToe />} />
          <Route path='/UltimateTicTacToe' element={<UltimateTicTacToe />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;