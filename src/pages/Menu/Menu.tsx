import './Menu.scss'
import TopBar from './TopBar';
import Options from './Options';

interface IMenuProps {

}

const Menu: React.FC<IMenuProps> = (props) => {

    return <div className='Menu'>
        <TopBar />
        <Options />
    </div>;
};

export default Menu;