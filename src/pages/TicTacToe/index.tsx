import './index.scss'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { TTicTacToeState, initializeTicTacToeState } from 'shared'
import circle from '@/util/svg/circle.svg';

interface ITicTacToeProps {

}
//{<img src={circle} className="App-logo" alt="logo" />}

const TicTacToe: React.FC<ITicTacToeProps> = (props) => {

  const [boardState, setBoardState] = useState<TTicTacToeState>(initializeTicTacToeState(20))
  const navigate = useNavigate();

  return <div className='TicTacToe'>
    <div className="score">Score</div>


    <div className="board">
      <div className="border"></div>
      {boardState.map((row, rowIndex) => <div key={rowIndex}>
        {row.map((square, squareIndex) => <div key={squareIndex}>
          { }
        </div>)}
      </div>)}
    </div>
    <div className="options">
      <button>play again</button>
      <button onClick={() => { navigate('/') }}>to menu</button>
    </div>
  </div>;
};

export default TicTacToe;