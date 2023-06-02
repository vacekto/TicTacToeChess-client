import './GenericSelect.scss'
import { ReactNode, useState, useRef, useEffect } from 'react'
import Arrowhead from '@/util/svg/components/ArrowHead';
import { v4 as uuidv4 } from 'uuid';

interface CustomSelectElement extends HTMLDivElement {
    dataset: {
        componentId: string
        componentName: 'generic-select'
    }
}

export interface ISelectedOption {
    index: number,
    item: ReactNode
}

export interface IExtendState {
    extended: boolean,
    componentId: string
}

type TSelectCb = (options: {
    index: number,
    item: ReactNode
}) => void

export interface IGenericSelectProps {
    options: ReactNode[],
    selectCallback?: TSelectCb,
    extendCallback?: (componentState: IExtendState) => void,
    activeGenericSelectId?: string,
    defaultDescription?: string,
    children?: ReactNode,
    eventTarget?: EventTarget
}

const GenericSelect: React.FC<IGenericSelectProps> = ({
    options,
    selectCallback,
    extendCallback,
    activeGenericSelectId,
    defaultDescription,
    children,
    eventTarget
}) => {

    const [renderedOptions, setRenderedOptions] = useState<ReactNode[]>([])
    const [indexOfSelected, setIndexOfSelected] = useState<number>(-1)
    const [extended, setExtended] = useState<boolean>(false)
    const componentRef = useRef<CustomSelectElement>({} as CustomSelectElement)

    const toggleExtend = () => {
        if (typeof extendCallback === 'function') extendCallback({
            componentId: componentRef.current.dataset.componentId,
            extended: extended ? false : true
        })
        setExtended(prevState => prevState ? false : true)
    }

    const handleSelect = (clickedIndex: number) => () => {
        const newIndex = indexOfSelected === clickedIndex ? -1 : clickedIndex
        setIndexOfSelected(newIndex)
        setExtended(false)
    }

    useEffect(() => {
        if (typeof selectCallback === 'function') selectCallback({
            index: indexOfSelected,
            item: renderedOptions[indexOfSelected]
        })
    }, [indexOfSelected])


    useEffect(() => {
        if (activeGenericSelectId === componentRef.current.dataset.componentId) return
        setExtended(false)
    }, [activeGenericSelectId])


    useEffect(() => {
        if (children) return
        setRenderedOptions(options)
    }, [options])


    useEffect(() => {
        if (renderedOptions.length <= indexOfSelected)
            setIndexOfSelected(-1)
    }, [renderedOptions])

    useEffect(() => {
        if (!children) return
        if (children instanceof Array) setRenderedOptions(children)
        else setRenderedOptions([children])
    }, [children])


    useEffect(() => {
        componentRef.current.dataset.componentId = uuidv4();
        componentRef.current.dataset.componentName = 'generic-select'

        if (!eventTarget) return
        eventTarget.addEventListener('selectSideIndex', ((event: CustomEvent) => {
            const newIndex = event?.detail?.index
            if (
                typeof newIndex === 'number' &&
                newIndex >= -1 &&
                newIndex < renderedOptions.length
            )
                setIndexOfSelected(newIndex)
        }) as EventListener)

    }, [])



    return <div
        className={`GenericSelect ${extended ? 'extended' : ''}`}
        ref={componentRef}
    >
        <div className="option selected" onClick={toggleExtend}>
            <div className="description">
                {indexOfSelected === -1 ? defaultDescription : renderedOptions[indexOfSelected]}
            </div>
            <div className="arrowhead">
                <Arrowhead stroke='black' />
            </div>
        </div>
        <div className="options">
            {renderedOptions.map((option, optionIndex) => {
                return <div
                    className={`option ${optionIndex === indexOfSelected ? 'active' : ''}`}
                    key={optionIndex}
                    onClick={handleSelect(optionIndex)}
                >
                    <div className='description'>
                        {option}
                    </div>
                </div>
            })}
        </div>
    </div>;
};

export default GenericSelect;