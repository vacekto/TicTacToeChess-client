import './Options.scss'
import { useState, useContext, useEffect } from 'react';
import SideBar from './SideBar/SideBar';
import { TGameName } from 'shared'
import { context } from '@/util/globalContext/ContextProvider';
import { socketProxy } from '@/util/socketSingleton';

interface IOptionsProps {
    setActiveSideBar: React.Dispatch<React.SetStateAction<"gameInvites" | "usersOnline" | null>>
    activeSideBar: "gameInvites" | "usersOnline" | null
}

const Options: React.FC<IOptionsProps> = ({ activeSideBar, setActiveSideBar }) => {
    const [selectedGame, setSelectedGame] = useState<TGameName | ''>('')
    const {
        updateGlobalState,
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



    return <div className='Options'>
        <SideBar activeSideBar={activeSideBar} />
        <div className="listAndOptions">
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
        </div>
    </div>
};

export default Options;