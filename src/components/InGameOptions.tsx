import './InGameOptions.scss'
import Home from '@/components/icons/HomeSVG';
import Repeat from '@/components/icons/RepeatSVG';
import LightMode from '@/components/icons/LightModeSVG';
import { useContext } from 'react';
import { context } from '@/util/globalContext/ContextProvider';

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