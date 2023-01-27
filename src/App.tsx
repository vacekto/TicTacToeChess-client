import './App.scss';
import Menu from './pages/Menu';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Menu />} />
          <Route path='/TicTacToe' />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;