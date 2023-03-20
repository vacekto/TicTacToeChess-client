import './GameInvite.scss'
import { socketProxy } from '@/util/socketSingleton';
import { IGameInvite } from 'shared';

interface IGameInviteProps {
    invite: IGameInvite
}

const GameInvite: React.FC<IGameInviteProps> = ({ invite }) => {

    const handleAccept = () => {
        socketProxy.emit('accept_invite', invite.id)
    }

    const handleDecline = () => {
        socketProxy.emit('decline_invite', invite.id)
    }

    return (
        <div className='GameInvite'>
            {'sernder: ' + invite.sender}
            {'game: ' + invite.game}
            <button onClick={handleAccept}>accept</button>
            <button onClick={handleDecline}>ignore</button>
        </div>
    );
}

export default GameInvite