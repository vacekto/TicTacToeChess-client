interface IModalExitProps {

}

const ModalExit: React.FC<IModalExitProps> = () => {

    const lineLength = 66
    const lineWidth = 10

    const start = (100 - lineLength) / 2
    const end = start + lineLength

    return <svg viewBox="0 0 100 100">
        <line x1={start} y1={start} x2={end} y2={end} strokeWidth={lineWidth} strokeLinecap="round" />
        <line x1={start} y1={end} x2={end} y2={start} strokeWidth={lineWidth} strokeLinecap="round" />
    </svg>;
};

export default ModalExit;