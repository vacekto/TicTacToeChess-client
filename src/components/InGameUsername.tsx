import './InGameUsername.scss'
import { useContext } from 'react'
import { context } from '@/context/GlobalStateProvider'

interface IInGameUsernameProps {
    username: string
    opponentUsername: string
}

const InGameUsername: React.FC<IInGameUsernameProps> = ({ username, opponentUsername }) => {
    const { gameSide, opponentGameSide } = useContext(context)

    return <div className='InGameUsername'>
        <div className={"username " + gameSide}>
            {username}
        </div>
        <div className={"username + " + opponentGameSide}>
            {opponentUsername}
        </div>
    </div >;
};

export default InGameUsername;