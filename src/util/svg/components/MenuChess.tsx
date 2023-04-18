interface IMenuChessProps {

}
//style="enable-background:new 0 0 16 16;"
const MenuChess: React.FC<IMenuChessProps> = (props) => {
    const colors = {
        main: '#039683',
        background: 'white'
    }


    const viewboxSize = 400

    const squareNum = 8
    const squareSize = 35

    const shift = (viewboxSize - squareNum * squareSize) / 2

    const lineWidth = 10
    const lineLength = 60


    return <svg viewBox={`0 0 ${viewboxSize} ${viewboxSize}`}>
        <rect x="0" y="0" width={viewboxSize} height={viewboxSize} fill={colors.background} />

        <line x1={shift / 2} y1={shift / 2} x2={shift / 2} y2={shift / 2 + lineLength} stroke={colors.main} strokeWidth={lineWidth} strokeLinecap="round" />
        <line x1={shift / 2} y1={shift / 2} x2={shift / 2 + lineLength} y2={shift / 2} stroke={colors.main} strokeWidth={lineWidth} strokeLinecap="round" />

        <line x1={viewboxSize - shift / 2} y1={shift / 2} x2={viewboxSize - shift / 2 - lineLength} y2={shift / 2} stroke={colors.main} strokeWidth={lineWidth} strokeLinecap="round" />
        <line x1={viewboxSize - shift / 2} y1={shift / 2} x2={viewboxSize - shift / 2} y2={shift / 2 + lineLength} stroke={colors.main} strokeWidth={lineWidth} strokeLinecap="round" />

        <line x1={shift / 2} y1={viewboxSize - shift / 2} x2={shift / 2 + lineLength} y2={viewboxSize - shift / 2} stroke={colors.main} strokeWidth={lineWidth} strokeLinecap="round" />
        <line x1={shift / 2} y1={viewboxSize - shift / 2} x2={shift / 2} y2={viewboxSize - shift / 2 - lineLength} stroke={colors.main} strokeWidth={lineWidth} strokeLinecap="round" />

        <line x1={viewboxSize - shift / 2} y1={viewboxSize - shift / 2} x2={viewboxSize - shift / 2} y2={viewboxSize - shift / 2 - lineLength} stroke={colors.main} strokeWidth={lineWidth} strokeLinecap="round" />
        <line x1={viewboxSize - shift / 2} y1={viewboxSize - shift / 2} x2={viewboxSize - shift / 2 - lineLength} y2={viewboxSize - shift / 2} stroke={colors.main} strokeWidth={lineWidth} strokeLinecap="round" />


        {(new Array(squareNum).fill(null).map((row, rowIndex) => {
            return (new Array(squareNum).fill(null).map((square, squareIndex) => {
                return <rect
                    x={squareIndex * squareSize + shift}
                    y={rowIndex * squareSize + shift}
                    width={squareSize}
                    height={squareSize}
                    fill={((rowIndex + squareIndex) % 2) === 0 ? colors.main : colors.background}
                    key={rowIndex + squareIndex}
                />
            }))
        }))}
    </svg>;
};

export default MenuChess