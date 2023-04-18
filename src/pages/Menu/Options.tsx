import './Options.scss'
import { useState, useContext, useEffect, useRef } from 'react';
import SideBar from './SideBar/SideBar';
import { TGameName } from 'shared'
import { context } from '@/context/GlobalStateProvider';
import { socketProxy } from '@/util/socketSingleton';
import MenuTicTacToe from '@/util/svg/components/MenuTicTacToe'
import MenuChess from '@/util/svg/components/MenuChess';
import GameOption from '@/components/GameOption';
import { handleMenuResize } from '@/util/functions';

interface IOptionsProps {
    setActiveSideBar: React.Dispatch<React.SetStateAction<"gameInvites" | "usersOnline" | null>>
    activeSideBar: "gameInvites" | "usersOnline" | null
}

const Options: React.FC<IOptionsProps> = ({ activeSideBar, setActiveSideBar }) => {
    const [selectedGame, setSelectedGame] = useState<TGameName | ''>('')
    const gameListRef = useRef<HTMLDivElement>(null)
    const { updateGlobalState, } = useContext(context)


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
        handleMenuResize(gameListRef.current as HTMLDivElement)
    }, [])


    return <div className='Options'>
        <SideBar activeSideBar={activeSideBar} />
        <div className="listAndOptions" ref={gameListRef}>
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
                        gameName='ULTIMATE TIC TAC TOE'
                    >
                        <MenuTicTacToe />
                    </GameOption>
                    <GameOption
                        selectGame={selectGame('chess')}
                        gameName='CHESS'
                    >
                        <MenuChess />
                    </GameOption>
                </div>
                :
                <div className="gameOptionsContainer">
                    {selectedGame === 'uTicTacToe' ?
                        <h1>
                            <div>Ultimate</div>
                            <div>Tic Tac Toe</div>
                        </h1> :
                        <h1>{selectedGame}</h1>
                    }
                    <div className="gameOptions">
                        <button className='customButton' onClick={handleHotseat}>Hetseat</button>
                        <button className='customButton' onClick={handleFindOpponent}>Find opponent</button>
                        <button className='customButton'>vs PC</button>
                        <button className='customButton' onClick={selectGame('')}>Back to menu</button>
                    </div>
                </div>
            }
        </div>
    </div >
};

export default Options;