import './CustomButton.scss'
import { ReactNode } from 'react'

interface IButtonProps {
    children: ReactNode,
    callback?: () => void
}

const CustomButton: React.FC<IButtonProps> = ({ children, callback }) => {

    return <button className='Button' onClick={callback}>
        {children}
    </button>
};

export default CustomButton;