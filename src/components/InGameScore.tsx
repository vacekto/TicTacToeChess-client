import './InGameScore.scss'
import CircleSVG from '@/util/svg/components/CircleSVG';
import CrossSVG from '@/util/svg/components/CrossSVG';
import Scales from '@/util/svg/components/ScalesSVG';

interface IInGameScoreProps {
    score: {
        X: number,
        O: number,
        draw: number
    }
}

const InGameScore: React.FC<IInGameScoreProps> = ({ score }) => {

    return <div className='InGameScore'>
        <div className='player1'>
            <div className='scoreIcon'>
                <CircleSVG />
            </div>
            <div>{score.O} wins</div>
        </div>
        <div className='player2'>
            <div className='scoreIcon'>
                <CrossSVG />
            </div>
            <div>{score.X} wins</div>
        </div>

        <div className='scales'>
            <div className='scoreIcon'>
                <Scales />
            </div>
            <div>{score.draw} draws</div>
        </div>
    </div>;
};

export default InGameScore;