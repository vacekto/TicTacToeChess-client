import './UsernameModal.scss'
import { useRef, useContext, useEffect, useState } from 'react';
import { context } from '@/util/globalContext/ContextProvider'
import { socketProxy } from '@/util/socketSingleton';

interface ITopBarProps {
    visible: boolean
}

const TopBar: React.FC<ITopBarProps> = ({ visible }) => {
    const usernameInputRef = useRef<HTMLInputElement>({} as HTMLInputElement)
    const checkboxRef = useRef<HTMLInputElement>({} as HTMLInputElement)
    const [focused, setFocused] = useState<Boolean>(false)
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
        usernameInputRef.current.addEventListener('focusin', () => {
            setFocused(true)
        })

        usernameInputRef.current.addEventListener('focusout', () => {
            setFocused(false)
        })


        if (showUsernameModal)
            usernameInputRef.current.focus()
    }, [showUsernameModal])

    return <div
        className='UsernameModal'
        style={visible ? {} : { display: 'none' }}
    >

        <div className="container">
            <div className="exit" onClick={exit}>X</div>
            <div className="input">
                <div className="label">
                    <div className="username">Username</div>
                    <div className="star">*</div>

                </div>
                <input
                    ref={usernameInputRef}
                    onKeyUp={handleSetUsername}
                    type="text"
                    className={focused ? 'focused' : ''}
                />
            </div>
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