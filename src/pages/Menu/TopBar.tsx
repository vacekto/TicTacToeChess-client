import './TopBar.scss'
import { useContext, CSSProperties, useRef } from 'react';
import { context } from '@/context/GlobalStateProvider';
import { ReactComponent as UsersSVG } from '@/util/svg/plain/users.svg'
import { ReactComponent as EnvelopeSVG } from '@/util/svg/plain/envelope.svg'


interface ITopBarProps {
    setActiveSideBar: React.Dispatch<React.SetStateAction<"gameInvites" | "usersOnline" | null>>
    activeSideBar: "gameInvites" | "usersOnline" | null
}

interface IPrevPropsRef {
    prev: "gameInvites" | "usersOnline" | null
    now: "gameInvites" | "usersOnline" | null
}

const TopBar: React.FC<ITopBarProps> = ({ activeSideBar, setActiveSideBar }) => {
    const {
        username,
        updateGlobalState,
        gameInvites
    } = useContext(context)

    const prevActiveSidebarRef = useRef<IPrevPropsRef>({
        prev: null,
        now: activeSideBar
    })

    const { now } = prevActiveSidebarRef.current
    if (activeSideBar !== now) {
        prevActiveSidebarRef.current.prev = now
        prevActiveSidebarRef.current.now = activeSideBar
    }


    const showModal = () => {
        const stateUpdate = { showUsernameModal: true }
        updateGlobalState(stateUpdate)
    }


    const selectSidebar = (option: "gameInvites" | "usersOnline") => () => {
        if (option === activeSideBar) setActiveSideBar(null)
        else setActiveSideBar(option)
    }


    const indicatorContainerStyle = (() => {
        const style: CSSProperties = { left: '-3px' }
        if (activeSideBar === 'gameInvites') style.left = '57px'
        if (
            prevActiveSidebarRef.current.prev !== null &&
            prevActiveSidebarRef.current.now === null
        )
            style.transitionDelay = '.2s'

        if (
            prevActiveSidebarRef.current.prev === null &&
            prevActiveSidebarRef.current.now !== null
        ) {
            style.transition = '0s'
        }

        return style
    })()

    const indicatorStyle = (() => {
        const style: CSSProperties = { width: '0px' }
        if (activeSideBar) return { width: '100%' }

        return style
    })()

    const invitesCountStyle = (() => {
        const style: CSSProperties = {}
        if (gameInvites.length === 0) style.display = 'none'
        return style
    })()

    return <div className='TopBar'>
        <div className="sideBarOptions">
            <div
                className={'usersOnline ' + (activeSideBar === 'usersOnline' ? 'active' : '')}
                onClick={selectSidebar('usersOnline')}
            >
                <UsersSVG />
            </div>
            <div
                className={'gameInvites ' + (activeSideBar === 'gameInvites' ? 'active' : '')}
                onClick={selectSidebar('gameInvites')}
            >
                <EnvelopeSVG />
                <div className="invitesCount" style={invitesCountStyle}>
                    <div>
                        {gameInvites.length}
                    </div>
                </div>
            </div>
            <div className="indicatorContainer" style={indicatorContainerStyle}>
                <div className="indicator" style={indicatorStyle} ></div>
            </div>
        </div>
        {username ?
            <div className="username" onClick={showModal}>
                {username}
            </div> :
            <button className='customButton' onClick={showModal}>
                Set username
            </ button>
        }
    </div >;
};

export default TopBar;