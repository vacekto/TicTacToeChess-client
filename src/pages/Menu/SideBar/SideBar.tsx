import './SideBar.scss'
import User from './User'
import { CSSProperties, useContext, useRef } from 'react'
import { context } from '@/context/GlobalStateProvider'
import { v4 as uuidv4 } from 'uuid';
import GameInvite from './GameInvite'

interface ISideBarProps {
    activeSideBar: "gameInvites" | "usersOnline" | null
}

const SideBar: React.FC<ISideBarProps> = ({ activeSideBar }) => {
    const { username, usersOnline, gameInvites } = useContext(context)
    const styles: CSSProperties = activeSideBar ? {} : { display: 'none' }

    return (
        <div
            className='SideBar'
            style={styles}
        >
            <div className="activeBarName">
                {activeSideBar === 'usersOnline' ? 'Users online' : 'Game invitations'}
            </div>
            {activeSideBar === 'gameInvites' ?
                gameInvites.map(invite => {
                    return <GameInvite
                        invite={invite}
                        key={uuidv4()}
                    />
                })
                :
                usersOnline.map((user, userIndex) => {
                    return username === user ? null :
                        <User
                            key={userIndex}
                            username={user}
                        />
                })
            }
        </div>
    );
}

export default SideBar