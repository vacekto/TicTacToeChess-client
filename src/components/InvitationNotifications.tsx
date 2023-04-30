import './InvitationNotifications.scss'
import { useContext } from 'react'
import { context } from '@/context/GlobalStateProvider';
import { IGameInviteWithTimestamp } from '@/context/globalReducer';
import { socketProxy } from '@/util/socketSingleton';
import { IGameInvite } from 'shared';

interface IInvitationNotificationsProps {
}

const InvitationNotifications: React.FC<IInvitationNotificationsProps> = () => {
    const {
        inviteNotifications,
        removeInvite
    } = useContext(context)

    const handleAccept = (invite: IGameInviteWithTimestamp) => () => {
        const inv: IGameInvite = {
            game: invite.game,
            invitee: invite.invitee,
            sender: invite.sender
        }

        socketProxy.emit('accept_invite', inv)

        removeInvite(invite)
    }

    const handleDecline = (invite: IGameInviteWithTimestamp) => () => {
        removeInvite(invite)
    }


    return <div className='InvitationNotifications'>
        {inviteNotifications.map((invite, index) => {
            return <div className='notification' key={index}>
                <div className="message">
                    {`${invite.sender} has invited you the the game of ${invite.game}`}
                </div>
                <div className="action">
                    <div className="container">
                        <div onClick={handleAccept(invite)}>
                            Accept
                        </div>
                    </div>
                    <div className="container">
                        <div onClick={handleDecline(invite)}>
                            decline
                        </div>
                    </div>
                </div>

            </div>
        })}
    </div>
};

export default InvitationNotifications;