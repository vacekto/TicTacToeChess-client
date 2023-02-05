import './InGameScore.scss'
import { TGameName } from 'shared';
import CircleSVG from '@/components/svg/CircleSVG';
import CrossSVG from '@/components/svg/CrossSVG';
import Scales from '@/components/svg/ScalesSVG';

interface IInGameScoreProps {
    game: TGameName
}

const InGameScore: React.FC<IInGameScoreProps> = ({ game }) => {



    return <div className='InGameScore'>
        <div className='player1'>
            <div className='scoreIcon'>
                <CircleSVG />
            </div>
            <div>4 wins</div>
        </div>
        <div className='player2'>
            <div className='scoreIcon'>
                <CrossSVG />
            </div>
            <div>2 wins</div>
        </div>

        <div className='scales'>
            <div className='scoreIcon'>
                <Scales />
            </div>
            <div>2 draws</div>
        </div>
    </div>;
};

export default InGameScore;