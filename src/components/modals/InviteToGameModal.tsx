import './InviteToGameModal.scss'
import GenericModal from './GenericModal';
import CircleSVG from '@/util/svg/components/CircleSVG';
import CrossSVG from '@/util/svg/components/CrossSVG';
import { ISelectedOption } from '../GenericSelect';
import { ReactNode, useEffect, useRef, useState, useContext } from 'react';
import { ReactComponent as Wn } from '@/util/svg/plain/WKnight.svg'
import { ReactComponent as Bn } from '@/util/svg/plain/BKnight.svg'
import GenericSelectDecorator from '../GenericSelectDecorator';
import { IGameInvite, TGameName, TGameSide } from 'shared';
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
    const { username } = useContext(context)
    // const [selectedSide, setSelectedSide] = useState<TGameSide | ''>('')
    // const [sideOptions, setSideOptions] = useState<TOptions<TGameSide>>([])
    // const sidesEvetTargetRef = useRef(new EventTarget())

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

    // const gameSides: Record<TGameName, TOptions<TGameSide>> = {
    //     chess: [{
    //         render: <Wn />,
    //         value: 'w'
    //     },
    //     {
    //         render: <Bn />,
    //         value: 'b'
    //     }],
    //     ticTacToe: [{
    //         render: <CircleSVG />,
    //         value: 'O'
    //     },
    //     {
    //         render: <CrossSVG />,
    //         value: 'X'
    //     }],
    //     uTicTacToe: [{
    //         render: <CircleSVG />,
    //         value: 'O'
    //     },
    //     {
    //         render: <CrossSVG />,
    //         value: 'X'
    //     }]
    // }


    const selectGameCallback = (selectedOption: ISelectedOption) => {
        const index = selectedOption.index
        let selectedGameUpdate: TGameName | ''
        selectedGameUpdate = index === -1 ? '' : gameOptions[index].value
        setSelectedGame(selectedGameUpdate)
    }

    // const selectSideCallback = (selectedOption: ISelectedOption) => {
    //     const index = selectedOption.index
    //     let selectedSideUpdate: TGameSide | ''
    //     selectedSideUpdate = index === -1 ? '' : sideOptions[index].value
    //     setSelectedSide(selectedSideUpdate)
    // }

    const inviteCallback = () => {
        if (selectedGame) {
            const invite: IGameInvite = {
                game: selectedGame,
                invitee: inviteeUsername,
                sender: username
            }
            socketProxy.emit('game_invite', invite)
        }
        exitModal()
    }

    // useEffect(() => {
    //     const sideOptionsUpdate = selectedGame ? gameSides[selectedGame] : []
    //     setSideOptions(sideOptionsUpdate)
    //     setSelectedSide('')

    //     const selectSideEvent = new CustomEvent('selectSideIndex', {
    //         detail: { index: -1 }
    //     })

    //     sidesEvetTargetRef.current.dispatchEvent(selectSideEvent)
    // }, [selectedGame])


    return <GenericModal visible={visible} exitModal={exitModal}>
        <div className='InviteToGameModal'>

            <h3>Game</h3>
            <GenericSelectDecorator
                options={gameOptions.map(o => o.render)}
                selectCallback={selectGameCallback}
            />
            {/* 
            <h3>Side</h3>
            <GenericSelectDecorator
                options={sideOptions.map(o => o.render)}
                selectCallback={selectSideCallback}
                eventTarget={sidesEvetTargetRef.current}
            /> 
            */}

            <button
                className='customButton submitButton'
                onClick={inviteCallback}
            >send invite</button>
        </div >

    </GenericModal>
};

export default InviteToGameModal;