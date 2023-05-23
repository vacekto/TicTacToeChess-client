import './SelectSideModal.scss'
import GenericModal from "./GenericModal"
import CrossSVG from '@/util/svg/components/CrossSVG'
import CircleSVG from '@/util/svg/components/CircleSVG'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { context } from '@/context/GlobalStateProvider'
import ChessPiece from '@/util/svg/components/ChessPiece'
import { TGameName, TGameSide } from 'shared'
import ThreeDots from '../ThreeDots'
import { socketProxy } from '@/util/socketSingleton'
import Chess from '@/pages/Chess/Chess'

interface IGameInfo {
    gameSide: TGameSide,
    icon: ReactNode
}

type IGameSideMap = Record<TGameName, IGameInfo>


interface ISelectSideModalProps { }


const SelectSideModal: React.FC<ISelectSideModalProps> = () => {
    const { gameName, gameMode, updateGlobalState, gameSide } = useContext(context)
    const [visible, setVisible] = useState<boolean>(gameMode === 'multiplayer' ? true : false)
    const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null)


    const left: IGameSideMap = {
        ticTacToe: {
            gameSide: 'X',
            icon: < CrossSVG />
        },
        uTicTacToe: {
            gameSide: 'X',
            icon: < CrossSVG />

        },
        chess: {
            gameSide: 'w',
            icon: <ChessPiece piece={'wn'} />
        }
    }


    const right: IGameSideMap = {
        ticTacToe: {
            gameSide: 'O',
            icon: < CircleSVG />
        },
        uTicTacToe: {
            gameSide: 'O',
            icon: < CircleSVG />

        },
        chess: {
            gameSide: 'b',
            icon: <ChessPiece piece={'bn'} />
        }
    }

    const sides = { left, right }

    const handleSelectSide = (side: 'left' | 'right') => () => {
        if (selectedSide) return
        setSelectedSide(side)


        const gameSide = sides[side][gameName as TGameName]?.gameSide
        socketProxy.emit('select_side', gameSide)
    }

    const setIconStyleClass = (side: 'left' | 'right') => {
        let classname = `icon ${side} `
        if (!selectedSide) {
            classname += 'selectable '
            return classname
        }

        if (selectedSide === side)
            classname += 'selected '
        if (gameSide && gameSide !== sides[side][gameName as TGameName]?.gameSide)
            classname += 'shrink'

        return classname
    }

    const generateMessage = () => {
        if (!selectedSide) return <h2>Choose side</h2>
        if (!gameSide) return <>
            <h2>Waiting for opponent</h2>
            <ThreeDots />
        </>

        return <h2 >You play as</h2>
    }


    useEffect(() => {
        if (gameSide) setTimeout(() => setVisible(false), 2000)
    }, [gameSide])

    useEffect(() => {
        if (gameMode === 'multiplayer') setVisible(true)
    }, [gameMode])

    useEffect(() => {
        socketProxy.on('set_side', side => {
            updateGlobalState({
                gameSide: side
            })
        })
        return () => {
            socketProxy.removeListener('set_side')
        }
    }, [])


    return <GenericModal visible={visible} >
        <div className="SelectSideModal">
            <div className='message'>
                {generateMessage()}
            </div>
            <div className="icons">
                <div
                    className={`${setIconStyleClass('left')}`}
                    onClick={handleSelectSide('left')}
                >
                    {left[gameName as TGameName]?.icon}
                </div>

                <div
                    className={`${setIconStyleClass('right')}`}
                    onClick={handleSelectSide('right')}
                >
                    {right[gameName as TGameName]?.icon}
                </div>
            </div>
        </div>
    </GenericModal >
}

export default SelectSideModal