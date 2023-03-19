import './Menu.scss'
import TopBar from './TopBar';
import Options from './Options';
import { useState } from 'react';

interface IMenuProps {

}

const Menu: React.FC<IMenuProps> = (props) => {
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