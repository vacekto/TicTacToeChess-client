import { useContext } from 'react'
import { context } from '@/util/globalContext/ContextProvider';

interface ICircleSVGProps {
}

const CircleSVG: React.FC<ICircleSVGProps> = () => {
    
    return <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="25" strokeWidth="11" fill="transparent" />
    </svg>
};

export default CircleSVG;