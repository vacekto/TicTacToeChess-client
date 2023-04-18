import './Menu.scss'
import TopBar from './TopBar';
import Options from './Options';
import { useEffect, useRef, useState } from 'react';

interface IMenuProps {

}

const Menu: React.FC<IMenuProps> = () => {
    const [activeSideBar, setActiveSideBar] = useState<'gameInvites' | 'usersOnline' | null>(null)



    return <div className='Menu'>
        <TopBar
            activeSideBar={activeSideBar}
            setActiveSideBar={setActiveSideBar}
        />
        <Options
            activeSideBar={activeSideBar}
            setActiveSideBar={setActiveSideBar}
        />
    </div>;
};

export default Menu;