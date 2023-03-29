import './UsernameModal.scss'
import { useRef, useContext, useEffect, useState } from 'react';
import { context } from '@/util/globalContext/ContextProvider'
import { socketProxy } from '@/util/socketSingleton';
import Checkbox from '@/util/svg/components/check';
import CrossSVG from './icons/CrossSVG';
import Modal from './Modal';

interface ITopBarProps {
    visible: boolean
}

const TopBar: React.FC<ITopBarProps> = ({ visible }) => {
    const usernameInputRef = useRef<HTMLInputElement>({} as HTMLInputElement)
    const [rememberUsername, setRememberUsername] = useState<boolean>(false)
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
        if (rememberUsername)
            localStorage.setItem('username', username)
    }

    const exit = () => {
        updateGlobalState({ showUsernameModal: false })
    }

    const toggleCheck = () => {
        setRememberUsername(prevState => {
            return prevState === true ? false : true
        })
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

    return <Modal visible={visible}>
        <div className="UsernameModal">
            <h2>Change username</h2>
            <div className="exit" onClick={exit}>
                <CrossSVG />
            </div>
            <div className={"input " + (focused ? 'focused' : '')}>
                <div className="label">
                    <div className="username">Display name</div>
                    <div className="star">*</div>

                </div>
                <input
                    ref={usernameInputRef}
                    onKeyUp={handleSetUsername}
                    type="text"
                />
            </div>
            <div className='remember'>
                <div
                    className={"label " + (rememberUsername ? 'checked' : '')}
                    onClick={toggleCheck}>
                    Remember username:
                </div>
                <div
                    className={"checkbox " + (rememberUsername ? 'checked' : '')}
                    onClick={toggleCheck}
                >
                    <Checkbox />
                </div>

            </div>
            <div className="buttonContainer">
                <button className='customButton'>Submit</button>
            </div>

        </div >;
    </Modal>

};

export default TopBar;