import './SideBar.scss'
import { useContext, CSSProperties } from 'react'
import { context } from '@/util/globalContext/ContextProvider'
import User from './User'

interface ISideBarProps {
    activeSideBar: "gameInvites" | "usersOnline" | null
}

const SideBar: React.FC<ISideBarProps> = ({ activeSideBar }) => {
    const { usersOnline } = useContext(context)

    const styles: CSSProperties = activeSideBar ? {} : { display: 'none' }

    return (
        <div className='SideBar' style={styles}>
            {activeSideBar}
            {usersOnline.map((username, index) => {
                return <User
                    key={index}
                    username={username}
                />
            })}
        </div>
    );
}

export default SideBar