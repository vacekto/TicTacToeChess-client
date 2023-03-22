import './GameOption.scss'
import { ReactNode } from 'react'
import { TGameName } from 'shared'

interface IGameOptionProps {
    children: ReactNode,
    selectGame: () => void,
    gameName: string
}

const GameOption: React.FC<IGameOptionProps> = ({ children, selectGame, gameName }) => {

    return <div className='GameOption' onClick={selectGame}>
        <div className="icon">
            {children}
        </div>
        <div className='gameName'>
            <div className="filler">
                {gameName}
            </div>
        </div>
    </div>;
};

export default GameOption;