import './InvitationNotifications.scss'
import { useLocation } from 'react-router-dom';
import { useContext, useRef } from 'react'
import { context } from '@/context/GlobalStateProvider';

interface IInvitationNotificationsProps {
}

const InvitationNotifications: React.FC<IInvitationNotificationsProps> = () => {
    const location = useLocation();
    const { inviteNotifications } = useContext(context)

    const invitationStyle: React.CSSProperties = location.pathname === '/' ?
        { top: '80px' } : {}


    return <div style={invitationStyle}>
        {inviteNotifications.map(invite => {
            return <div className="InvitationNotifications">
                <div className="info">User {invite.sender} invtited you to the game of <div>{invite.game}</div> !</div>
                <div className="action">
                    <div><div>accept</div></div>
                    <div><div>decline</div></div>
                </div>

            </div>
        })}
    </div>
};

export default InvitationNotifications;