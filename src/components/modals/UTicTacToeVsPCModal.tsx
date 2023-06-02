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


    const selectSide = ({ index }: ISelectedOption) => {
        const side = index === -1 ?
            null :
            sideOptions[index].value
        setSide(side)
    }

    const handleStart = () => {
        if (!side) return
        updateGlobalState({
            gameSide: side,
            gameName: 'uTicTacToe',
        })
    }





    return <GenericModal visible={visible} exitModal={exitModal}>
        <div className="TicTacToeVsPCModal">
            <h3>Game side</h3>
            <GenericSelectDecorator
                options={sideOptions.map(option => option.icon)}
                selectCallback={selectSide}
            />

            <button className="customButton" onClick={handleStart}>
                start game
            </button>
        </div>


    </GenericModal >
}

export default TicTacToeVsPCModal