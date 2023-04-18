import './GenericModal.scss'
import { ReactNode, useEffect } from 'react'
import ModalExit from '@/util/svg/components/ModalExit'


interface IGenericModalProps {
    children: ReactNode
    visible: boolean
    exitCallback?: () => void
}

const GenericModal: React.FC<IGenericModalProps> = ({ children, visible, exitCallback }) => {

    const handleExit = () => {
        if (exitCallback) exitCallback()
    }


    return <div
        className='GenericModal'
        style={visible ? {} : { display: 'none' }}
    >
        <div className="container" >
            <div className="exitIcon" onClick={handleExit}>
                <ModalExit />
            </div>

            {children}
        </div>
    </div>
}

export default GenericModal;