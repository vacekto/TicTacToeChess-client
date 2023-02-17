import { createContext, ReactNode, useState, useRef, MutableRefObject } from "react";
import { ChessGame, TGameName, TGameInstance } from "shared";

export interface IContext {
    theme: 'light' | 'dark',
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
    gameRef: MutableRefObject<TGameInstance | null>
};


export const context = createContext<IContext>({} as IContext);
interface IContextProviderProps {
    children: ReactNode
}

const ContextProvider: React.FC<IContextProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const gameRef = useRef<TGameInstance | null>(null);

    return <context.Provider value={{ gameRef, theme, setTheme }}>
        {children}
    </context.Provider>;
};

export default ContextProvider;


