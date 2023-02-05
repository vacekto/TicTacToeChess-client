import './InGameOptions.scss'
import Home from '@/components/svg/HomeSVG';
import Repeat from '@/components/svg/RepeatSVG';
import LightMode from '@/components/svg/LightModeSVG';

interface IInGameOptionsProps {
  homeCb: () => void,
  resetCb: () => void,
  lightModeCb: () => void
}

const InGameOptions: React.FC<IInGameOptionsProps> = ({
  homeCb,
  resetCb,
  lightModeCb
}) => {

  return <div className='InGameOptions'>
    <div onClick={homeCb}>
      <Home />
    </div>
    <div onClick={resetCb}>
      <Repeat />
    </div>
    <div onClick={lightModeCb}>
      <LightMode />
    </div>
  </div>;
};

export default InGameOptions;