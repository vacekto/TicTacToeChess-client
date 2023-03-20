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

    return (
        <div className='GameInvite'>
            {'sernder: ' + invite.sender}
            {'game: ' + invite.game}
            <button onClick={handleAccept}>accept</button>
        </div>
    );
}

export default GameInvite