import './ChessHistory.scss'
import { Backward, Forward, ToEnd, ToStart, Pause, Play } from './icons/History';

const ChessHistory: React.FC = () => {

    return <div className='ChessHistory'>
        <div><ToStart /></div>
        <div><Backward /></div>
        <div><Play /></div>
        <div><Forward /></div>
        <div><ToEnd /></div>
    </div>;
};

export default ChessHistory;