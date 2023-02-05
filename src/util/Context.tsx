import { createContext, ReactNode, useState } from "react";

export interface IContext {
    theme: 'light' | 'dark',
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
};

const initialContext: IContext = {
    theme: "light",
    setTheme: () => { }
}

export const context = createContext<IContext>(initialContext);


interface IContextProviderProps {
    children: ReactNode
}



const ContextProvider: React.FC<IContextProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    return <context.Provider value={{ ...initialContext, theme, setTheme }}>
        {children}
    </context.Provider>;
};

export default ContextProvider;


