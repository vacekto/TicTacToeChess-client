interface ICircleSVGProps {
}

const CircleSVG: React.FC<ICircleSVGProps> = () => {

    return <svg viewBox="0 0 100 100" className='CircleSVG'>
        <circle cx="50" cy="50" r="40" strokeWidth="14" fill="transparent" />
    </svg>
};

export default CircleSVG;