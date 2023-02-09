import './Switch.scss'
import { useState, useEffect } from 'react'
import CircleSVG from '@/components/icons/CircleSVG';
import CrossSVG from '@/components/icons/CrossSVG';


interface ISwitchProps {
    isPlaying: 'X' | 'O' | 'black' | 'white'
}

const Switch: React.FC<ISwitchProps> = ({ isPlaying }) => {
    const [pos, setPos] = useState<'left' | 'right'>(['O', 'black'].includes(isPlaying) ? 'left' : 'right')

    useEffect(() => {
        setPos(['O', 'black'].includes(isPlaying) ? 'left' : 'right')
    }, [isPlaying])

    return <div className={`Switch ${pos === 'left' ? 'flexStart' : 'flexEnd'}`} >
        <div className="icons">
            <div className={`left iconContainer ${pos === 'left' ? 'active' : ''}`}>
                <CircleSVG />
            </div>
            <div className={`right iconContainer ${pos === 'left' ? '' : 'active'}`}>
                <CrossSVG />
            </div>
        </div>
        <div className="indicatorContainer">
            <div className={`indicator ${pos === 'left' ? 'left' : 'right'}`}></div>
        </div>
    </div>;
};

export default Switch;