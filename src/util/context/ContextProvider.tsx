import { TGameSide, TGameInstance } from "shared";
import {
    createContext,
    ReactNode,
    useState,
    useRef,
    MutableRefObject
} from "react";

export interface IContext {
    gameRef: MutableRefObject<TGameInstance | null>
    theme: 'light' | 'dark',
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
    gameSide: TGameSide | ''
    setGameSide: React.Dispatch<React.SetStateAction<TGameSide | ''>>
    opponentGameSide: TGameSide | ''
    setOpponentGameSide: React.Dispatch<React.SetStateAction<TGameSide | ''>>
    username: string
    setUsername: React.Dispatch<React.SetStateAction<string>>
    opponentUsername: string
    setOpponentUsername: React.Dispatch<React.SetStateAction<string>>
};

export const context = createContext<IContext>({
    theme: 'light',
    username: 'Tom'
} as IContext);

interface IContextProviderProps {
    children: ReactNode
}

const ContextProvider: React.FC<IContextProviderProps> = ({ children }) => {
    const [username, setUsername] = useState<string>('')
    const [opponentUsername, setOpponentUsername] = useState<string>('')
    const [gameSide, setGameSide] = useState<TGameSide | ''>('')
    const [opponentGameSide, setOpponentGameSide] = useState<TGameSide | ''>('')
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const gameRef = useRef<TGameInstance | null>(null);



    return <context.Provider value={{
        gameRef,
        theme,
        setTheme,
        gameSide,
        setGameSide,
        opponentGameSide,
        setOpponentGameSide,
        username,
        setUsername,
        opponentUsername,
        setOpponentUsername
    }}>
        {children}
    </context.Provider>;
};

export default ContextProvider;