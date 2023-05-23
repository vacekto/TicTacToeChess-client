import './GenericModal.scss'
import { ReactNode, MouseEvent, useEffect } from 'react'
import ModalExit from '@/util/svg/components/ModalExit'


interface IGenericModalProps {
    children?: ReactNode
    visible: boolean
    exitModal?: () => void
}

const GenericModal: React.FC<IGenericModalProps> = ({ children, visible, exitModal }) => {

    const backgroundClick = () => {
        if (typeof exitModal === 'function') exitModal()
    }

    const noExitOnClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    }

    useEffect(() => {
        if (typeof exitModal !== 'function') return
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') exitModal()
        })
    }, [])

    return <div
        className='GenericModal'
        style={visible ? {} : { display: 'none' }}
        onClick={backgroundClick}
    >
        <div className="container" onClick={noExitOnClick}>
            {exitModal ?
                <div className="exitIcon" onClick={exitModal}>
                    <ModalExit />
                </div>
                : null
            }
            {children}
        </div>
    </div>
}

export default GenericModal;