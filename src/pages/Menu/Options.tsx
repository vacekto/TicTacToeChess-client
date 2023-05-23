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
import ThreeDots from '@/components/ThreeDots';
import TicTacToeHotseatModal from '@/components/modals/TicTacToeHotseatModal';
import { IGlobalState } from '@/context/globalReducer';


interface IOptionsProps {
    setActiveSideBar: React.Dispatch<React.SetStateAction<"gameInvites" | "usersOnline" | null>>
    activeSideBar: "gameInvites" | "usersOnline" | null
}

const Options: React.FC<IOptionsProps> = ({ activeSideBar }) => {
    const [selectedGame, setSelectedGame] = useState<TGameName | ''>('')
    const [searchingForOpponent, setSearchingForOpponent] = useState<TGameName[]>([])
    const gameListRef = useRef<HTMLDivElement>(null)
    const { updateGlobalState, gameMode } = useContext(context)

    const selectGame = (gameName: TGameName | '') => () => {
        setSelectedGame(gameName)
    }

    const handleHotseat = () => {
        if (selectedGame === 'ticTacToe') {
            updateGlobalState({
                gameMode: 'hotseat'
            })
            return
        }
        const gameSide = selectedGame === 'chess' ? 'w' : 'O'
        const state: Partial<IGlobalState> = {
            gameMode: 'hotseat',
            gameName: selectedGame,
            gameSide
        }

        updateGlobalState(state)
    }

    const handleFindOpponent = () => {
        if (!selectedGame) return

        setSearchingForOpponent(prevState => {
            if (prevState.includes(selectedGame))
                return [...prevState].filter(game => game !== selectedGame)
            return [...prevState, selectedGame]
        })
    }

    useEffect(() => {
        if (selectedGame && searchingForOpponent.includes(selectedGame))
            socketProxy.emit('join_lobby', selectedGame)
        if (selectedGame && !searchingForOpponent.includes(selectedGame))
            socketProxy.emit('leave_lobby')
    }, [searchingForOpponent])

    useEffect(() => {
        handleMenuResize(gameListRef.current as HTMLDivElement)

        return () => {
            socketProxy.emit('leave_lobby')
        }
    }, [])


    return <div className='Options'>
        <TicTacToeHotseatModal
            visible={selectedGame === 'ticTacToe' && gameMode === 'hotseat'}
            exitModal={() => { updateGlobalState({ gameMode: '' }) }}
        />
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
                        <button className='customButton' onClick={handleHotseat}>Hotseat</button>
                        <button className='customButton' onClick={handleFindOpponent}>

                            {
                                searchingForOpponent.includes(selectedGame) ?
                                    <>
                                        <div className='text' >Awaiting opponent</div>
                                        <ThreeDots size='small' />
                                    </> :
                                    <div className='text' >Find opponent</div>

                            }
                        </button>
                        <button className='customButton'>vs PC</button>
                        <button className='customButton' onClick={selectGame('')}>Back to menu</button>
                    </div>
                </div>
            }
        </div>
    </div >
};

export default Options;