import './Switch.scss'
import { useState, useEffect } from 'react'
import CircleSVG from '@/util/svg/components/CircleSVG';
import CrossSVG from '@/util/svg/components/CrossSVG';


interface ISwitchProps {
    activePlayer: 'X' | 'O' | 'black' | 'white'
}

const Switch: React.FC<ISwitchProps> = ({ activePlayer }) => {
    const [pos, setPos] = useState<'left' | 'right'>(['O', 'black'].includes(activePlayer) ? 'left' : 'right')

    useEffect(() => {
        setPos(['O', 'black'].includes(activePlayer) ? 'left' : 'right')
    }, [activePlayer])

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