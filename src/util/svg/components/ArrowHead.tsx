interface IArrowHeadProps {
    stroke?: string
}

const ArrowHead: React.FC<IArrowHeadProps> = ({ stroke }) => {

    const A = {
        X: '50',
        Y: '70'
    }

    const B = {
        X: '20',
        Y: '40'
    }

    const C = {
        X: '80',
        Y: '40'
    }

    const lineWidth = 15

    return <svg viewBox="0 0 100 100" stroke={stroke ? stroke : ''}>
        <line x1={A.X} y1={A.Y} x2={B.X} y2={B.Y} strokeWidth={lineWidth} strokeLinecap="round" />
        <line x1={C.X} y1={C.Y} x2={A.X} y2={A.Y} strokeWidth={lineWidth} strokeLinecap="round" />
    </svg>

};

export default ArrowHead;