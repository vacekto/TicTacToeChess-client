import './InGameOptions.scss'
import Home from '@/util/svg/components/HomeSVG';
import Repeat from '@/util/svg/components/RepeatSVG';
import LightMode from '@/util/svg/components/LightModeSVG';
import { useContext } from 'react';
import { context } from '@/context/GlobalStateProvider';

interface IInGameOptionsProps {
  resetCb: () => void,
}

const InGameOptions: React.FC<IInGameOptionsProps> = ({
  resetCb,
}) => {
  const { updateGlobalState, switchLightTheme } = useContext(context)

  const handleHomeCklick = () => {
    updateGlobalState({
      gameName: ''
    })
  }

  return <div className='InGameOptions'>
    <div onClick={handleHomeCklick}>
      <Home />
    </div>
    <div onClick={resetCb}>
      <Repeat />
    </div>
    <div onClick={switchLightTheme}>
      <LightMode />
    </div>
  </div>;
};

export default InGameOptions;