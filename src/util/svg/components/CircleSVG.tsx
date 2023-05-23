interface ICircleSVGProps {
    style?: React.CSSProperties
}

const CircleSVG: React.FC<ICircleSVGProps> = ({ style }) => {

    return <svg viewBox="0 0 100 100" className='CircleSVG' style={style}>
        <circle cx="50" cy="50" r="40" strokeWidth="14" fill="transparent" />
    </svg>
};

export default CircleSVG;