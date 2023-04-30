import './GenericModal.scss'
import { ReactNode, MouseEvent, useEffect } from 'react'
import ModalExit from '@/util/svg/components/ModalExit'


interface IGenericModalProps {
    children: ReactNode
    visible: boolean
    exitModal: () => void
}

const GenericModal: React.FC<IGenericModalProps> = ({ children, visible, exitModal }) => {

    const exitOnClick = () => {
        exitModal()
    }

    const stopPropagation = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    }

    useEffect(() => {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') exitModal()
        })
    }, [])

    return <div
        className='GenericModal'
        style={visible ? {} : { display: 'none' }}
        onClick={exitOnClick}
    >
        <div className="container" onClick={stopPropagation}>
            <div className="exitIcon" onClick={exitModal}>
                <ModalExit />
            </div>

            {children}
        </div>
    </div>
}

export default GenericModal;