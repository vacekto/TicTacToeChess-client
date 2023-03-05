import './InGameUsername.scss'

interface IInGameUsernameProps {
    username: string
    opponentUsername: string
}

const InGameUsername: React.FC<IInGameUsernameProps> = ({ username, opponentUsername }) => {

    return <div className='InGameUsername'>
        <div className="localPlayer">
            {username}
        </div>
        <div className="opponent">
            {opponentUsername}
        </div>
    </div >;
};

export default InGameUsername;