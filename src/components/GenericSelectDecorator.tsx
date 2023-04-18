import { useContext, useEffect } from 'react'
import { IGenericSelectProps, IExtendState } from './GenericSelect/GenericSelect'
import GenericSelect from './GenericSelect/GenericSelect'
import { context } from '@/context/GlobalStateProvider'
import { trackActiveGenericSelect } from '@/util/functions'

type TGenericSelectDecoratorProps = React.FC<
    Omit<IGenericSelectProps, 'activeGenericSelectId' | 'extendedCallback'>
>

const GenericSelectDecorator: TGenericSelectDecoratorProps = (props) => {
    const { activeGenericSelectId, updateGlobalState } = useContext(context)

    const extendCallback = (componentState: IExtendState) => {
        const newActiveId = componentState.extended ? componentState.componentId : ''
        updateGlobalState({
            activeGenericSelectId: newActiveId
        })
    }

    useEffect(() => {
        trackActiveGenericSelect(updateGlobalState)
    }, [])

    return <GenericSelect
        {...props}
        extendCallback={extendCallback}
        activeGenericSelectId={activeGenericSelectId}
    >
        {props.children}
    </GenericSelect>

}

export default GenericSelectDecorator