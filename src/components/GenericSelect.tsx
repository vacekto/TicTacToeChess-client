import './GenericSelect.scss'
import { ReactNode, useState, useRef, useEffect } from 'react'
import Arrowhead from '@/util/svg/components/ArrowHead';
import { v4 as uuidv4 } from 'uuid';

export interface ISelectedOption {
    index: number,
    item: ReactNode
}

interface ComponentElement extends HTMLDivElement {
    dataset: {
        componentId: string
        componentName: 'generic-select'
    }
}

export interface IExtendState {
    extended: boolean,
    componentId: string
}

export interface IGenericSelectProps {
    options: ReactNode[],
    selectCallback?: (selectedOption: ISelectedOption) => void,
    extendCallback?: (componentState: IExtendState) => void,
    activeGenericSelectId?: string,
    defaultDescription?: string,
    children?: ReactNode,
    selectIndex?: () => void
}

const GenericSelect: React.FC<IGenericSelectProps> = ({
    options,
    selectCallback,
    extendCallback,
    activeGenericSelectId,
    defaultDescription,
    children,
    selectIndex
}) => {

    const [renderedOptions, setRenderedOptions] = useState<ReactNode[]>([])
    const [indexOfSelected, setIndexOfSelected] = useState<number>(-1)
    const [extended, setExtended] = useState<boolean>(false)
    const componentRef = useRef<ComponentElement>({} as ComponentElement)

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
        if (children instanceof Array) setRenderedOptions(children)
        setRenderedOptions([children])
    }, [children])

    useEffect(() => {
        componentRef.current.dataset.componentId = uuidv4();
        componentRef.current.dataset.componentName = 'generic-select'
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