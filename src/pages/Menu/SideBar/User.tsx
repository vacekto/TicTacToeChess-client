import './User.scss'
import { socketProxy } from '@/util/socketSingleton';
interface IUserProps {
    username: string
}

const User: React.FC<IUserProps> = ({ username }) => {
    const handleInvite = () => {
        socketProxy.emit('invite_player', username, 'chess')
    }

    return (
        <div className='User'>
            <div className="username">
                {username}
            </div>
            <button onClick={handleInvite}>invite</button>
        </div>
    );
}

export default User