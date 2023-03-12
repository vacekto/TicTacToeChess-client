import './TopBar.scss'
import { useContext } from 'react';
import { context } from '@/util/globalContext/ContextProvider';

interface ITopBarProps {

}

const TopBar: React.FC<ITopBarProps> = () => {
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

    return <div className='TopBar'>
        <div className="username" onClick={showModal}>
            {username ? username : 'Set username'}
        </div>
    </div >;
};

export default TopBar;