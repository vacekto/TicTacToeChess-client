interface ICheckProps {

}

const Check: React.FC<ICheckProps> = () => {

    const centerX = 42
    const centerY = 75

    const lengthShort = 25
    const lengthLong = 45

    return <svg viewBox="0 0 100 100" >
        <line x1={centerX} y1={centerY} x2={centerX - lengthShort} y2={centerY - lengthShort} strokeWidth="13" strokeLinecap="round" />
        <line x1={centerX} y1={centerY} x2={centerX + lengthLong} y2={centerY - lengthLong} strokeWidth="13" strokeLinecap="round" />
    </svg>;
};

export default Check;