import './Modal.scss'
import { ReactNode } from 'react'

interface IModalProps {
    children: ReactNode
    visible: boolean
}

const Modal: React.FC<IModalProps> = ({ children, visible }) => {

    return <div
        className='Modal'
        style={visible ? {} : { display: 'none' }}
    >
        {children}
    </div >;
};

export default Modal;