import './UsernameModal.scss'
import { useRef, useContext, useEffect, useState, KeyboardEvent } from 'react';
import { context } from '@/context/GlobalStateProvider'
import { socketProxy } from '@/util/socketSingleton';
import Checkbox from '@/util/svg/components/Check';
import GenericModal from './GenericModal';

interface ITopBarProps {
}

const UsernameModal: React.FC<ITopBarProps> = () => {
    const usernameInputRef = useRef<HTMLInputElement>({} as HTMLInputElement)
    const [rememberUsername, setRememberUsername] = useState<boolean>(false)
    const [focused, setFocused] = useState<Boolean>(false)
    const {
        updateGlobalState,
        showUsernameModal,
        usernameErrorMsg
    } = useContext(context)


    const handleSubmit = () => {
        const username = usernameInputRef.current.value.trim()
        if (
            !username ||
            username.length > 15 ||
            username.includes(' ')
        ) {
            console.error('spatne jmeno')
            return
        }
        if (socketProxy.connected)
            socketProxy.emit('change_username', username)
        else socketProxy.connect(username)
        if (rememberUsername)
            localStorage.setItem('username', username)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return
        handleSubmit()
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
        if (!usernameErrorMsg) return
        setTimeout(() => {
            updateGlobalState({
                usernameErrorMsg: undefined
            })
        }, 5000)
    }, [usernameErrorMsg])

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


    return <GenericModal visible={showUsernameModal} exitModal={exit} >
        <div className="UsernameModal"  >
            <h2>Change username</h2>

            <div className={"input " + (focused ? 'focused' : '')}>
                <div className="label">
                    <div className="username">Display name</div>
                    <div className="star">*</div>

                </div>
                <input
                    ref={usernameInputRef}
                    onKeyDown={handleKeyDown}
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
                <div className="errorMessage">
                    <h4>{usernameErrorMsg}</h4>
                </div>
            </div>
            <div className="buttonContainer">
                <button className='customButton' onClick={handleSubmit}>Submit</button>
            </div>

        </div >
    </GenericModal>
};

export default UsernameModal;