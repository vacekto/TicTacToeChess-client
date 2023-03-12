import './Options.scss'
import { useState, useContext } from 'react';
import { TGameName } from 'shared'
import { context } from '@/util/globalContext/ContextProvider';

interface IOptionsProps {

}

const Options: React.FC<IOptionsProps> = () => {
    const [selectedGame, setSelectedGame] = useState<TGameName | ''>('')
    const { updateGlobalState } = useContext(context)

    const selectGame = (gameName: TGameName | '') => () => {
        setSelectedGame(gameName)
    }

    const handleHotseatClick = () => {
        updateGlobalState({
            gameName: selectedGame,
            gameMode: 'hotseat'
        })
    }

    return <div className='Options'>
        {!selectedGame ?
            <div className="gameList">
                <div onClick={selectGame('ticTacToe')}>TicTacToe</div>
                <div onClick={selectGame('uTicTacToe')}>Ultimate TicTacToe</div>
                <div onClick={selectGame('chess')}>Chess</div>
            </div>
            :
            <div className="gameOptionsContainer">
                <h1>{selectedGame}</h1>
                <div className="gameOptions">
                    <div onClick={handleHotseatClick}>Hetseat</div>
                    <div onClick={() => { }}>Find opponent</div>
                    <div>vs PC</div>
                    <div onClick={selectGame('')}>Back to menu</div>
                </div>
            </div>
        }
    </div>;
};

export default Options;