import { IGameInvite } from 'shared';
import reducer, {
    IGameInviteWithTimestamp,
    IGlobalState,
} from './globalReducer'
import {
    createContext,
    ReactNode,
    useReducer,
} from "react";
import { socketProxy } from '@/util/socketSingleton';


const savedUsername = localStorage.getItem('username')

const defaultGlobalState: IGlobalState = {
    theme: 'light',
    gameSide: '',
    opponentGameSide: '',
    username: savedUsername ? savedUsername : '',
    opponentUsername: '',
    showUsernameModal: savedUsername ? false : true,
    usernameErrorMsg: '',
    gameName: '',
    gameMode: '',
    usersOnline: [],
    gameInvites: [],
    inviteNotifications: [],
    activeGenericSelectId: '',
}

interface IGlobalContext extends IGlobalState {
    updateGlobalState: (stateUpdate: Partial<IGlobalState>) => void
    switchLightTheme: () => void
    handleNewInvite: (newInvite: IGameInvite) => void
    removeInvite: (invite: IGameInviteWithTimestamp) => void
    removeNotification: (invite: IGameInviteWithTimestamp) => void
}

export const context = createContext<IGlobalContext>(defaultGlobalState as IGlobalContext);

interface IContextProviderProps {
    children: ReactNode
}


const ContextProvider: React.FC<IContextProviderProps> = ({ children }) => {
    const [globalState, dispatch] = useReducer(reducer, defaultGlobalState)

    const updateGlobalState = (stateUpdate: Partial<IGlobalState>) => {

        dispatch({
            type: 'STATE_UPDATE',
            payload: { stateUpdate }
        })

        if (
            globalState.gameMode === 'multiplayer' &&
            stateUpdate.gameMode !== 'multiplayer'
        )
            socketProxy.emit('leave_game')
    }

    const switchLightTheme = () => {
        const stateUpdate: Partial<IGlobalState> = {
            theme: globalState.theme === 'light' ? 'dark' : 'light'
        }
        updateGlobalState(stateUpdate)
    }

    const removeNotification = (invite: IGameInviteWithTimestamp) => {
        dispatch({
            type: 'REMOVE_NOTIFICATION',
            payload: { invite }
        })
    }

    const removeInvite = (invite: IGameInviteWithTimestamp) => {
        dispatch({
            type: 'REMOVE_INVITATION',
            payload: { invite }
        })

        removeNotification(invite)
    }


    const handleNewInvite = (invite: IGameInvite) => {
        const newInvite = invite as IGameInviteWithTimestamp
        newInvite.timestamp = Date.now()

        dispatch({
            type: 'NEW_INVITATION',
            payload: { invite: newInvite }
        })

        setTimeout(() => {
            removeNotification(newInvite)
        }, 6000, newInvite)
    }



    return <context.Provider value={{
        ...globalState,
        switchLightTheme,
        updateGlobalState,
        handleNewInvite,
        removeInvite,
        removeNotification
    }}>
        {children}
    </context.Provider >;
};

export default ContextProvider;