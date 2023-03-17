import './Options.scss'
import { useState, useContext, useEffect } from 'react';
import { TGameName } from 'shared'
import { context } from '@/util/globalContext/ContextProvider';

interface IOptionsProps { }

const Options: React.FC<IOptionsProps> = () => {
    const [selectedGame, setSelectedGame] = useState<TGameName | ''>('')
    const {
        updateGlobalState,
        socketProxy,
    } = useContext(context)

    const selectGame = (gameName: TGameName | '') => () => {
        setSelectedGame(gameName)
    }

    const handleHotseat = () => {
        updateGlobalState({
            gameName: selectedGame,
            gameMode: 'hotseat'
        })
    }

    const handleFindOpponent = () => {
        socketProxy.emit('join_lobby', selectedGame as TGameName)
    }

    useEffect(() => {
        return () => {
            socketProxy.emit('leave_lobby')
        }
    }, [])

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
                    <div onClick={handleHotseat}>Hetseat</div>
                    <div onClick={handleFindOpponent}>Find opponent</div>
                    <div>vs PC</div>
                    <div onClick={selectGame('')}>Back to menu</div>
                </div>
            </div>
        }
    </div>;
};

export default Options;