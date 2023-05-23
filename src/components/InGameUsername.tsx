import './InGameUsername.scss'

interface IInGameUsernameProps {
    username: string
    opponentUsername: string
}

const InGameUsername: React.FC<IInGameUsernameProps> = ({ username, opponentUsername }) => {

    return <div className='InGameUsername'>
        <div className={"username"}>
            {username}
        </div>
        <div className={"username"}>
            {opponentUsername}
        </div>
    </div >;
};

export default InGameUsername;