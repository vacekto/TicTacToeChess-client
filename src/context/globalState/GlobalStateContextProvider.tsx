import reducer, {
    IGlobalState,
} from './reducer'
import {
    createContext,
    ReactNode,
    useReducer,
} from "react";
import { IGameInvite } from 'shared';


interface IContext extends IGlobalState {
    updateGlobalState: (stateUpdate: Partial<IGlobalState>) => void
    switchLightTheme: () => void
    addInvite: (invite: IGameInvite) => void
}

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
    gameInvites: []
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


    const addInvite = (invite: IGameInvite) => {
        dispatch({
            type: 'NEW_INVITE',
            payload: { invite }
        })
    }


    return <context.Provider value={{
        ...globalState,
        switchLightTheme,
        updateGlobalState,
        addInvite
    }}>
        {children}
    </context.Provider >;
};

export default ContextProvider;