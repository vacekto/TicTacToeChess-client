import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from './pages/Menu';
import TicTacToe from './pages/TicTacToe';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Menu />} />
          <Route path='/TicTacToe' element={<TicTacToe />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;