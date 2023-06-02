import { useContext, useEffect } from 'react'
import { IGenericSelectProps, IExtendState } from './GenericSelect'
import GenericSelect from './GenericSelect'
import { context } from '@/context/GlobalStateProvider'
import { trackActiveGenericSelect } from '@/util/functions'

type TGenericSelectDecorator = React.FC<
    Omit<IGenericSelectProps, 'activeGenericSelectId' | 'extendedCallback'>
>

const GenericSelectDecorator: TGenericSelectDecorator = (props) => {
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