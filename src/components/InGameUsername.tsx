import './InGameUsername.scss'
import CrossSVG from './icons/CrossSVG'
import CircleSVG from './icons/CircleSVG'
import { useContext } from 'react'
import { context } from '@/util/globalContext/ContextProvider'
import chessSVG from '@/pages/Chess/icons/ChessPiece'

interface IInGameUsernameProps {
    username: string
    opponentUsername: string
}

const InGameUsername: React.FC<IInGameUsernameProps> = ({ username, opponentUsername }) => {
    const { gameSide, opponentGameSide } = useContext(context)

    const icons = {
        O: <CircleSVG />,
        X: <CrossSVG />,
        w: chessSVG.wn,
        b: chessSVG.bk
    }

    return <div className='InGameUsername'>
        <div className="playerInfo">
            <div className="username">
                {username}
            </div>
            <div className="icon">
                {icons[gameSide as keyof typeof icons]}
            </div>
        </div>

        <div className="playerInfo">
            <div className="username">
                {opponentUsername}
            </div>
            <div className="icon">
                {icons[opponentGameSide as keyof typeof icons]}
            </div>

        </div>
    </div >;
};

export default InGameUsername;