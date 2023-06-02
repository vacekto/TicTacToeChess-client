import './ChessVsPCModal.scss'
import GenericModal from './GenericModal'
import GenericSelectDecorator from '../GenericSelectDecorator'
import { useState, ReactNode } from 'react'
import { ISelectedOption } from '../GenericSelect'
import { useContext } from 'react'
import { context } from '@/context/GlobalStateProvider'
import ChessPiece from '@/util/svg/components/ChessPiece'

interface ISideOption {
    value: 'b' | 'w',
    icon: ReactNode
}


interface IChessVsPCModalProps {
    visible: boolean
    exitModal: () => void
}

const ChessVsPCModal: React.FC<IChessVsPCModalProps> = ({ visible, exitModal }) => {
    const [side, setSide] = useState<'w' | 'b' | null>(null)
    const [difficulty, setDifficulty] = useState<number | null>(null)
    const { updateGlobalState } = useContext(context)

    const sideOptions: ISideOption[] = [
        {
            value: 'w',
            icon: <ChessPiece piece='wp' />
        },
        {
            value: 'b',
            icon: <ChessPiece piece='bp' />
        }
    ]

    const difficultyOptions = ['Well-trained monkey', 'Beginner', 'Intermediate', 'Advanced', 'Experienced']

    const selectSide = ({ index }: ISelectedOption) => {
        const side = index === -1 ?
            null : sideOptions[index].value
        setSide(side)
    }

    const selectDifficulty = ({ index }: ISelectedOption) => {
        const difficulty = index === -1 ?
            null : (index + 1)
        setDifficulty(difficulty)
    }

    const handleStart = () => {
        if (!side || !difficulty) return
        updateGlobalState({
            gameSide: side,
            gameName: 'chess',
            startingSide: side,
            chessDfficulty: difficulty
        })
    }

    return <GenericModal visible={visible} exitModal={exitModal}>
        <div className="ChessVsPCModal">
            <h3>Game side</h3>
            <GenericSelectDecorator
                options={sideOptions.map(option => option.icon)}
                selectCallback={selectSide}
            />
            <h3>Difficulty</h3>
            <GenericSelectDecorator
                options={difficultyOptions}
                selectCallback={selectDifficulty}
            />

            <button className="customButton" onClick={handleStart}>
                start game
            </button>
        </div>
    </GenericModal >
}

export default ChessVsPCModal