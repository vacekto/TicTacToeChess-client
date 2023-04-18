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
            <div className="info">
                <div>
                    {'Opponent: ' + invite.sender}
                </div>
                <div>
                    {'Game: ' + invite.game}
                </div>
            </div>
            <div className="action">
                <button className='customButton' onClick={handleAccept}>accept</button>
                <button className='customButton' onClick={handleDecline}>ignore</button>
            </div>
        </div>
    );
}

export default GameInvite