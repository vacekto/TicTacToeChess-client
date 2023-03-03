import { useContext } from "react";
import { context } from './ContextProvider'

type TUseTheme = () => {
    theme: "light" | "dark"
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
}


const useTheme: TUseTheme = () => {
    const { theme, setTheme } = useContext(context)
    return {
        theme, setTheme
    }
}

export default useTheme