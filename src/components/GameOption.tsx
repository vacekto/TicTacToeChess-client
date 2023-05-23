import './GameOption.scss'
import { ReactNode } from 'react'

interface IGameOptionProps {
    children: ReactNode,
    selectGame: () => void,
    gameName: string
}

const GameOption: React.FC<IGameOptionProps> = ({ children, selectGame, gameName }) => {

    const games = {

    }

    return <div className='GameOption' onClick={selectGame}>

        <div className="icon">
            {children}
        </div>
        <div className='gameName'>
            <div className="filler">
                {gameName === 'ULTIMATE TIC TAC TOE' ?
                    <div>
                        <div>ULTIMATE</div>
                        <div>TIC TAC TOE</div>
                    </div>
                    : gameName}
            </div>
        </div>
    </div>;
};

export default GameOption;