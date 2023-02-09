import './InGameOptions.scss'
import Home from '@/components/icons/HomeSVG';
import Repeat from '@/components/icons/RepeatSVG';
import LightMode from '@/components/icons/LightModeSVG';

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