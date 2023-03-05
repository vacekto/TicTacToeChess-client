import {
    TGameSide,
    ServerToClientEvents,
    ClientToServerEvents,
} from "shared";
import { io, Socket } from "socket.io-client";
import {
    createContext,
    ReactNode,
    useState,
    useRef,
} from "react";


export interface IContext {
    theme: 'light' | 'dark',
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
    gameSide: TGameSide | ''
    setGameSide: React.Dispatch<React.SetStateAction<TGameSide | ''>>
    opponentGameSide: TGameSide | ''
    setOpponentGameSide: React.Dispatch<React.SetStateAction<TGameSide | ''>>
    username: string
    setUsername: (username: string, saveToLocalStorage: boolean) => void
    opponentUsername: string
    setOpponentUsername: React.Dispatch<React.SetStateAction<string>>
    showUsernameModal: boolean
    setShowUsernameModal: React.Dispatch<React.SetStateAction<boolean>>
};

export const context = createContext<IContext>({
    theme: 'light',
    username: 'Tom'
} as IContext);


class MySocket {
    private static _instance: Socket<ServerToClientEvents, ClientToServerEvents> | null = null
    static get instance() {
        if (!this._instance) {
            this._instance = io("http://localhost:3001")
        }
        return this._instance
    }
}

interface IContextProviderProps {
    children: ReactNode
}

const ContextProvider: React.FC<IContextProviderProps> = ({ children }) => {
    const [username, _setUsername] = useState<string>('')
    const [opponentUsername, setOpponentUsername] = useState<string>('')
    const [gameSide, setGameSide] = useState<TGameSide | ''>('')
    const [opponentGameSide, setOpponentGameSide] = useState<TGameSide | ''>('')
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [showUsernameModal, setShowUsernameModal] = useState<boolean>(false)
    const [usernameError, setUsernameError] = useState<string>('')
    const socketRef = useRef(MySocket.instance)

    const setUsername = (name: string, saveToLocalStorage: boolean) => {
        if (name.length === 0) return
        socketRef.current.emit('setUsername', name, ({ status, message }) => {
            if (status === 'error') {
                setUsernameError(message)
                _setUsername('')
            }
            return
        })

        _setUsername(name)
        if (saveToLocalStorage) {
            localStorage.setItem('username', name)
            return
        }
        localStorage.removeItem('username')
    }


    return <context.Provider value={{
        theme,
        setTheme,
        gameSide,
        setGameSide,
        opponentGameSide,
        setOpponentGameSide,
        username,
        setUsername,
        opponentUsername,
        setOpponentUsername,
        setShowUsernameModal,
        showUsernameModal
    }}>
        {children}
    </context.Provider>;
};

export default ContextProvider;