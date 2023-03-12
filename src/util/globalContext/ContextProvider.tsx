import socketSingleton, { TClientSocket, createSocketProxy } from '../socketSingleton'
import reducer, {
    IGlobalState,
} from './reducer'
import {
    createContext,
    ReactNode,
    useReducer,
    useRef
} from "react";


interface IContext extends IGlobalState {
    updateGlobalState: (stateUpdate: Partial<IGlobalState>) => void
    switchLightTheme: () => void
    socketProxy: TClientSocket
}

const savedUsername = localStorage.getItem('username')

const defaultGlobalState: IGlobalState = {
    theme: 'light',
    gameSide: '',
    opponentGameSide: '',
    username: savedUsername ? savedUsername : '',
    opponentUsername: '',
    showUsernameModal: false,
    usernameErrorMsg: '',
    gameName: '',
    gameMode: '',
}


export const context = createContext<IContext>(defaultGlobalState as IContext);

interface IContextProviderProps {
    children: ReactNode
}

const socketProxy = createSocketProxy(socketSingleton.instance)

const ContextProvider: React.FC<IContextProviderProps> = ({ children }) => {
    const [globalState, dispatch] = useReducer(reducer, defaultGlobalState)
    const socketProxyRef = useRef<TClientSocket>(socketProxy)

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


    return <context.Provider value={{
        ...globalState,
        switchLightTheme,
        updateGlobalState,
        socketProxy: socketProxyRef.current
    }}>
        {children}
    </context.Provider >;
};

export default ContextProvider;