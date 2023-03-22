import './Options.scss'
import { useState, useContext, useEffect } from 'react';
import SideBar from './SideBar/SideBar';
import { TGameName } from 'shared'
import { context } from '@/util/globalContext/ContextProvider';
import { socketProxy } from '@/util/socketSingleton';
import MenuTicTacToe from '@/components/icons/MenuTicTacToe'
import MenuChess from '@/components/icons/MenuChess';
import GameOption from '@/components/GameOption';

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
                    <GameOption
                        selectGame={selectGame('ticTacToe')}
                        gameName='TIC TAC TOE'
                    >
                        <MenuTicTacToe />
                    </GameOption>
                    <GameOption
                        selectGame={selectGame('uTicTacToe')}
                        gameName='TIC TAC TOE'
                    >
                        <MenuTicTacToe />
                    </GameOption>
                    <GameOption
                        selectGame={selectGame('chess')}
                        gameName='TIC TAC TOE'
                    >
                        <MenuChess />
                    </GameOption>
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