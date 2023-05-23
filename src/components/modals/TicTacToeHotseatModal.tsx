import './TicTacToeHotseatModal.scss'
import { useState, useContext, useEffect } from 'react'
import GenericModal from "./GenericModal"
import GenericSelectDecorator from '../GenericSelectDecorator'
import { TTicTacToeSide } from 'shared'
import { ISelectedOption } from '../GenericSelect'
import { context } from '@/context/GlobalStateProvider'

interface ITicTacToeHotseatProps {
    visible: boolean
    exitModal?: () => void
}

const TicTacToeHotseatModal: React.FC<ITicTacToeHotseatProps> = ({ visible, exitModal }) => {
    const [size, setSize] = useState<number>(-1)
    const [winCondition, setWinCondition] = useState<number>(-1)
    const { updateGlobalState } = useContext(context)

    const sizeOptions = [3, 5, 8, 10, 12]
    const winConditionOptions = [3, 4, 5, 6, 7].filter(i => i <= size)

    const hnadleStart = () => {
        if (size === -1 || winCondition === -1) return
        let sides: [TTicTacToeSide, TTicTacToeSide] = ['O', 'X']
        const side = sides[Math.floor(Math.random() * 2)]

        updateGlobalState({
            gameSide: side,
            ticTacToeWinCondition: winCondition,
            ticTacToeBoardSize: size,
            gameName: 'ticTacToe'
        })
    }

    const selectSize = (option: ISelectedOption) => {
        const newSize = option.index === -1 ? -1 : option.item as number
        setSize(newSize)
    }

    const selectWinCondition = (option: ISelectedOption) => {
        const newWinCondition = option.index === -1 ? -1 : option.item as number
        setWinCondition(newWinCondition)
    }



    useEffect(() => {
        if (winCondition > size) setWinCondition(-1)
    }, [size])

    return <GenericModal visible={visible} exitModal={exitModal} >
        <div className="TicTacToeHotseatModal">
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

            <div className="startButtonContainer">
                <button className="customButton" onClick={hnadleStart}>
                    start game
                </button>
            </div>
        </div>
    </GenericModal >
}

export default TicTacToeHotseatModal 