import './UsernameModal.scss'
import { useRef, useContext, useEffect } from 'react';
import { context } from '@/util/globalContext/ContextProvider'
import { socketProxy } from '@/util/socketSingleton';

interface ITopBarProps {
    visible: boolean
}

const TopBar: React.FC<ITopBarProps> = ({ visible }) => {
    const usernameInputRef = useRef<HTMLInputElement>({} as HTMLInputElement)
    const checkboxRef = useRef<HTMLInputElement>({} as HTMLInputElement)
    const {
        updateGlobalState,
        showUsernameModal
    } = useContext(context)

    const handleSetUsername: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        const username = usernameInputRef.current.value
        if (e.key !== 'Enter' || !username) return
        if (socketProxy.connected)
            socketProxy.emit('change_username', username)
        else socketProxy.connect(username)
        if (checkboxRef.current.checked)
            localStorage.setItem('username', username)
    }

    const exit = () => {
        updateGlobalState({ showUsernameModal: false })
    }


    useEffect(() => {
        if (showUsernameModal)
            usernameInputRef.current.focus()
    }, [showUsernameModal])

    return <div
        className='UsernameModal'
        style={visible ? {} : { display: 'none' }}
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