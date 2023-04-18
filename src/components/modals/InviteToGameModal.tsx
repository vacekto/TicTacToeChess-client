import './InviteToGameModal.scss'
import GenericModal from './GenericModal';
import CircleSVG from '@/util/svg/components/CircleSVG';
import CrossSVG from '@/util/svg/components/CrossSVG';
import { ISelectedOption } from '../GenericSelect';
import { ReactNode, useEffect, useState } from 'react';
import { ReactComponent as Wn } from '@/util/svg/plain/WKnight.svg'
import { ReactComponent as Bn } from '@/util/svg/plain/BKnight.svg'
import GenericSelectDecorator from '../GenericSelectDecorator';
import { TGameName, TGameSide } from 'shared';

type TOptions<T> = {
    render: ReactNode,
    value: T
}[]


interface IInviteToGameModalProps {
    visible: boolean
    exitCallback?: () => void
}



const InviteToGameModal: React.FC<IInviteToGameModalProps> = ({ visible, exitCallback }) => {
    const [selectedGame, setSelectedGame] = useState<TGameName | ''>('')
    const [selectedSide, setSelectedSide] = useState<TGameSide | ''>('')
    const [sideOptions, setSideOptions] = useState<TOptions<TGameSide>>([])

    const gameOptions: TOptions<TGameName> = [{
        render: 'Tic tac toe',
        value: 'ticTacToe'
    }, {
        render: 'Ultimate Tic tac toe',
        value: 'uTicTacToe'
    }, {
        render: 'Chess',
        value: 'chess'
    }]

    const gameSides: Record<TGameName, TOptions<TGameSide>> = {
        chess: [{
            render: <Wn />,
            value: 'w'
        },
        {
            render: <Bn />,
            value: 'b'
        }],
        ticTacToe: [{
            render: <CircleSVG />,
            value: 'O'
        },
        {
            render: <CrossSVG />,
            value: 'X'
        }],
        uTicTacToe: [{
            render: <CircleSVG />,
            value: 'O'
        },
        {
            render: <CrossSVG />,
            value: 'X'
        }]
    }


    const selectGameCallback = (selectedOption: ISelectedOption) => {
        const index = selectedOption.index
        let selectedGameUpdate: TGameName | ''
        selectedGameUpdate = index === -1 ? '' : gameOptions[index].value
        setSelectedGame(selectedGameUpdate)
    }

    const selectSideCallback = (selectedOption: ISelectedOption) => {
        const index = selectedOption.index
        let selectedSideUpdate: TGameSide | ''
        selectedSideUpdate = index === -1 ? '' : sideOptions[index].value
        setSelectedSide(selectedSideUpdate)
    }

    const inviteCallback = () => {
        console.log('select')
    }

    useEffect(() => {
        const sideOptionsUpdate = selectedGame ? gameSides[selectedGame] : []
        setSideOptions(sideOptionsUpdate)
        setSelectedSide('')
        console.log('selectedGame')
    }, [selectedGame])


    return <GenericModal visible={visible} exitCallback={exitCallback}>
        <div className='InviteToGameModal'>

            <h3>Game</h3>
            <GenericSelectDecorator
                options={gameOptions.map(o => o.render)}
                selectCallback={selectGameCallback}
            />

            <h3>Side</h3>
            <GenericSelectDecorator
                options={sideOptions.map(o => o.render)}
                selectCallback={selectSideCallback}
            />

            <button
                className='customButton submitButton'
                onClick={inviteCallback}
            >invite</button>
        </div >

    </GenericModal>
};

export default InviteToGameModal;