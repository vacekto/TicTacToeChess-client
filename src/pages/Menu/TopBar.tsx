import './TopBar.scss'
import { useContext } from 'react';
import { context } from '@/util/context/ContextProvider';

interface ITopBarProps {

}

const TopBar: React.FC<ITopBarProps> = () => {
    const {
        username,
        setShowUsernameModal
    } = useContext(context)

    const showModal = () => {
        setShowUsernameModal(true)
    }
    return <div className='TopBar'>
        <div className="username" onClick={showModal}>
            {username ? username : 'Set username'}
        </div>
    </div >;
};

export default TopBar;