import './User.scss'
import InviteToGameModal from '@/components/modals/InviteToGameModal';
import { useState } from 'react';

interface IUserProps {
    username: string
}

const User: React.FC<IUserProps> = ({ username }) => {
    const [showModal, setShowModal] = useState(false)

    const handleInvite = () => {
        setShowModal(true)
    }

    const exitModal = () => {
        setShowModal(false)
    }

    return (
        <div className='User'>
            <InviteToGameModal
                visible={showModal}
                exitModal={exitModal}
                inviteeUsername={username}
            />
            <div className="username">
                {username}
            </div>
            <button
                className='customButton'
                onClick={handleInvite}
            >
                invite
            </button>
        </div>
    );
}

export default User