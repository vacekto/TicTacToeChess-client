import './GameInvite.scss'
import { socketProxy } from '@/util/socketSingleton';
import { useState, useEffect, useContext } from 'react';
import { context } from '@/context/GlobalStateProvider'
import { IGameInviteWithTimestamp } from '@/context/globalReducer';

interface IGameInviteProps {
    invite: IGameInviteWithTimestamp
}

const GameInvite: React.FC<IGameInviteProps> = ({ invite }) => {
    const [counter, setCounter] = useState<number>(Math.floor(((60000 - Date.now() + invite.timestamp) / 1000) % 60))
    const { removeInvite, updateGlobalState } = useContext(context)

    const handleAccept = () => {
        socketProxy.emit('accept_invite', invite)
        removeInvite(invite)
    }

    const handleDecline = () => {
        removeInvite(invite)
    }

    useEffect(() => {
        if (counter <= 0) removeInvite(invite)
    }, [counter])

    useEffect(() => {
        const id = setInterval(() => {
            setCounter(prevState => --prevState)
        }, 1000)

        return () => {
            clearInterval(id)
        }
    }, [])

    return (
        <div className='GameInvite' >
            <div className="info">
                <div>
                    <div>Opponent</div>
                    <div>{invite.senderUsername}</div>
                </div>
                <div>
                    <div>Game</div>
                    <div>{invite.game}</div>
                </div>
                <div>
                    <div>expires in:</div>
                    <div>{counter}</div>
                </div>
            </div>
            <div className="action">
                <button className='customButton' onClick={handleAccept}>accept</button>
                <button className='customButton' onClick={handleDecline} >Decline</button>
            </div>
        </div>
    );
}

export default GameInvite