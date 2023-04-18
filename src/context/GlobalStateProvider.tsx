import reducer, {
    IGlobalState,
} from './globalReducer'
import {
    createContext,
    ReactNode,
    useReducer,
} from "react";
import { IGameInvite } from 'shared';



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

interface IContext extends IGlobalState {
    updateGlobalState: (stateUpdate: Partial<IGlobalState>) => void
    switchLightTheme: () => void
    handleNewInvite: (newInvite: IGameInvite) => void
}

export const context = createContext<IContext>(defaultGlobalState as IContext);

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
    }

    const switchLightTheme = () => {
        const stateUpdate: Partial<IGlobalState> = {
            theme: globalState.theme === 'light' ? 'dark' : 'light'
        }
        updateGlobalState(stateUpdate)
    }



    const handleNewInvite = (newInvite: IGameInvite) => {

        setTimeout(() => {
            dispatch({
                type: 'REMOVE_NOTIFICATION',
                payload: { inviteId: newInvite.id }
            })
        }, 5000)

        setTimeout(() => {
            dispatch({
                type: 'REMOVE_INVITATION',
                payload: { inviteId: newInvite.id }
            })
        }, 90000)

        dispatch({
            type: 'NEW_GAME_INVITE',
            payload: { invite: newInvite }
        })

    }



    return <context.Provider value={{
        ...globalState,
        switchLightTheme,
        updateGlobalState,
        handleNewInvite,
    }}>
        {children}
    </context.Provider >;
};

export default ContextProvider;