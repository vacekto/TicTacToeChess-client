import './UsernameModal.scss'
import { useRef, useContext } from 'react';
import { context } from '@/util/context/ContextProvider'

interface ITopBarProps {
    visible: boolean
}   

const TopBar: React.FC<ITopBarProps> = ({ visible }) => {
    const usernameInputRef = useRef<HTMLInputElement>(null)
    const checkboxRef = useRef<HTMLInputElement>(null)
    const { setUsername, setShowUsernameModal } = useContext(context)

    const handleSetUsername: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            setUsername(usernameInputRef.current!.value, checkboxRef.current!.checked)
        }
    }

    const exit = () => {
        setShowUsernameModal(false)
    }


    return <div
        className='UsernameModal'
        style={visible ? {} : {
            display: 'none'
        }}
    >

        <div className="content">
            <div className="exit" onClick={exit}>X</div>
            Enter username:
            <input
                ref={usernameInputRef}
                onKeyUp={handleSetUsername}
                type="text"
            />
            <div>
                remember username:
                <input
                    type="checkbox"
                    ref={checkboxRef}
                />
            </div>
        </div>
    </div >;
};

export default TopBar;