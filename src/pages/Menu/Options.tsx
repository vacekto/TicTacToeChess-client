import './Options.scss'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

type TGameName = 'TicTacToe' | 'UltimateTicTacToe' | 'Chess'

interface IOptionsProps {

}

const Options: React.FC<IOptionsProps> = (props) => {
    const [selectedGame, setSelectedGame] = useState<TGameName | null>(null)
    const navigate = useNavigate();

    const selectGame = (gameName: TGameName | null) => () => {
        setSelectedGame(gameName)
    }

    return <div className='Options'>
        {!selectedGame ?
            <div className="gameList">
                <div onClick={selectGame('TicTacToe')}>TicTacToe</div>
                <div onClick={selectGame('UltimateTicTacToe')}>Ultimate TicTacToe</div>
                <div onClick={selectGame('Chess')}>Chess</div>
            </div>
            :
            <div className="gameOptionsContainer">
                <h1>{selectedGame}</h1>
                <div className="gameOptions">
                    <div onClick={() => { navigate(`/${selectedGame}`) }}>Hetseat</div>
                    <div>Find opponent</div>
                    <div onClick={selectGame(null)}>Back to menu</div>
                </div>
            </div>
        }


    </div>;
};

export default Options;