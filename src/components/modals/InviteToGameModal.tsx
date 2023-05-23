import './InviteToGameModal.scss'
import GenericModal from './GenericModal';
import { ISelectedOption } from '../GenericSelect';
import { ReactNode, useEffect, useState, useContext } from 'react';
import GenericSelectDecorator from '../GenericSelectDecorator';
import { IGameInvite, TGameName } from 'shared';
import { socketProxy } from '@/util/socketSingleton';
import { context } from '@/context/GlobalStateProvider';

type TOptions<T> = {
    render: ReactNode,
    value: T
}[]


interface IInviteToGameModalProps {
    visible: boolean
    exitModal: () => void
    inviteeUsername: string
}

const InviteToGameModal: React.FC<IInviteToGameModalProps> = ({ visible, exitModal, inviteeUsername }) => {
    const [selectedGame, setSelectedGame] = useState<TGameName | ''>('')
    const [size, setSize] = useState<number>()
    const [winCondition, setWinCondition] = useState<number>()
    const { updateGlobalState, username } = useContext(context)

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

    const sizeOptions = [3, 5, 8, 10, 12]
    const winConditionOptions = [3, 4, 5, 6, 7]
        .filter(i => size ? i <= size : false)

    const selectSize = (option: ISelectedOption) => {
        const newSize = option.item as number
        setSize(newSize)
    }

    const selectWinCondition = (option: ISelectedOption) => {
        const newWinCondition = option.item as number
        setWinCondition(newWinCondition)
    }



    const selectGameCallback = (selectedOption: ISelectedOption) => {
        const index = selectedOption.index
        let selectedGameUpdate: TGameName | ''
        selectedGameUpdate = index === -1 ? '' : gameOptions[index].value
        setSelectedGame(selectedGameUpdate)
    }


    const inviteCallback = () => {
        if (!selectedGame) return

        const invite: IGameInvite = {
            game: selectedGame,
            inviteeUsername: inviteeUsername,
            senderUsername: username,
            ticTacToeBoardSize: size,
            ticTacToeWinCondition: winCondition
        }

        socketProxy.emit('game_invite', invite)
        exitModal()
    }


    useEffect(() => {
        if (
            !size ||
            winCondition && size && winCondition > size
        )
            setWinCondition(undefined)
    }, [size])


    return <GenericModal visible={visible} exitModal={exitModal} >
        <div className='InviteToGameModal'>
            <h3>Game</h3>
            <GenericSelectDecorator
                options={gameOptions.map(o => o.render)}
                selectCallback={selectGameCallback}
            />

            {selectedGame === 'ticTacToe' ? <>
                <h3>Board dimension</h3>
                <GenericSelectDecorator
                    options={sizeOptions}
                    selectCallback={selectSize}
                />
            </> : null}

            {selectedGame === 'ticTacToe' ? <>
                <h3>Win condition</h3>
                <GenericSelectDecorator
                    options={winConditionOptions}
                    selectCallback={selectWinCondition}
                />
            </> : null}

            <button
                className='customButton submitButton'
                onClick={inviteCallback}
            >
                send invite
            </button>


        </div >

    </GenericModal>
};

export default InviteToGameModal;
