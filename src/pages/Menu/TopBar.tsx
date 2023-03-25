import './TopBar.scss'
import { useContext } from 'react';
import { context } from '@/util/globalContext/ContextProvider';
import CustomButton from '@/components/CustomButton'

interface ITopBarProps {
    setActiveSideBar: React.Dispatch<React.SetStateAction<"gameInvites" | "usersOnline" | null>>
    activeSideBar: "gameInvites" | "usersOnline" | null
}

const TopBar: React.FC<ITopBarProps> = ({ activeSideBar, setActiveSideBar }) => {
    const {
        username,
        updateGlobalState
    } = useContext(context)

    const showModal = () => {
        const stateUpdate = {
            showUsernameModal: true
        }
        updateGlobalState(stateUpdate)
    }


    const selectSidebar = (option: "gameInvites" | "usersOnline") => () => {
        if (option === activeSideBar) setActiveSideBar(null)
        else setActiveSideBar(option)
    }


    return <div className='TopBar'>
        <div className="sideBarOptions">
            <div
                className="gameInvites"
                onClick={selectSidebar('gameInvites')}
            >
                game invites
            </div>
            <div
                className="usersOnline"
                onClick={selectSidebar('usersOnline')}
            >
                users online
            </div>
        </div>

        {username ?
            <div className="username" onClick={showModal}>
                {username}
            </div> :
            <CustomButton>
                'Set username'
            </CustomButton>
        }
    </div >;
};

export default TopBar;