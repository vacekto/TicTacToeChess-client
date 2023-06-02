import './TicTacToeVsPCModal.scss'
import GenericModal from './GenericModal'
import GenericSelectDecorator from '../GenericSelectDecorator'
import { useState, ReactNode } from 'react'
import { ISelectedOption } from '../GenericSelect'
import CrossSVG from '@/util/svg/components/CrossSVG'
import CircleSVG from '@/util/svg/components/CircleSVG'
import { useContext } from 'react'
import { context } from '@/context/GlobalStateProvider'

interface ISideOption {
    value: 'X' | 'O',
    icon: ReactNode
}

interface ITicTacToeVsPCModalProps {
    visible: boolean
    exitModal: () => void
}

const TicTacToeVsPCModal: React.FC<ITicTacToeVsPCModalProps> = ({ visible, exitModal }) => {
    const [side, setSide] = useState<'X' | 'O' | null>(null)
    const [size, setSize] = useState<number | null>(null)
    const [winCondition, setWinCondition] = useState<number | null>(null)
    const { updateGlobalState, ticTacToeBoardSize } = useContext(context)

    const sideOptions: ISideOption[] = [
        {
            value: 'X',
            icon: <CrossSVG />
        },
        {
            value: 'O',
            icon: <CircleSVG />
        }
    ]

    const sizeOptions = [3, 5, 8, 10, 12]
    const winConditionOptions = [3, 4, 5, 6, 7].filter(i => {
        if (size === null) return true
        return i <= size
    })

    const selectSide = ({ index }: ISelectedOption) => {
        const side = index === -1 ?
            null : sideOptions[index].value
        setSide(side)
    }

    const handleStart = () => {
        if (!side || !size || !winCondition) return
        updateGlobalState({
            gameSide: side,
            gameName: 'ticTacToe',
            ticTacToeBoardSize: size,
            ticTacToeWinCondition: winCondition
        })
    }

    const selectSize = (option: ISelectedOption) => {
        const newSize = option.index === -1 ? null : option.item as number
        setSize(newSize)
    }

    const selectWinCondition = (option: ISelectedOption) => {
        const newWinCondition = option.index === -1 ? null : option.item as number
        setWinCondition(newWinCondition)
    }


    return <GenericModal visible={visible} exitModal={exitModal}>
        <div className="TicTacToeVsPCModal">
            <h3>Game side</h3>
            <GenericSelectDecorator
                options={sideOptions.map(option => option.icon)}
                selectCallback={selectSide}
            />
            <h3>
                Board dimensions
            </h3>
            <GenericSelectDecorator
                options={sizeOptions}
                selectCallback={selectSize}
            />

            <h3>
                Win condition
            </h3>
            <GenericSelectDecorator
                options={winConditionOptions}
                selectCallback={selectWinCondition}
            />

            <button className="customButton" onClick={handleStart}>
                start game
            </button>
        </div>


    </GenericModal >
}

export default TicTacToeVsPCModal