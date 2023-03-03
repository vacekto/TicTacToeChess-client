import './ChessHistory.scss'
import { Backward, Forward, ToEnd, ToStart, Pause, Play } from './icons/History';

interface IChessHistoryProps {
    forwardCb: () => void
    backwardCb: () => void
    fastForwardCb: () => void
    fastBackwardCb: () => void

}

const ChessHistory: React.FC<IChessHistoryProps> = ({ forwardCb, backwardCb, fastBackwardCb, fastForwardCb }) => {

    return <div className='ChessHistory'>
        <div onClick={fastBackwardCb}><ToStart /></div>
        <div onClick={backwardCb}><Backward /></div>
        <div onClick={forwardCb}><Forward /></div>
        <div onClick={fastForwardCb}><ToEnd /></div>
    </div>;
};

export default ChessHistory;