
interface IMenuTicTacToeProps {

}
const MenuTicTacToe: React.FC<IMenuTicTacToeProps> = () => {
    const backgroundColor = 'white'
    const viewboxSize = 1000
    const shift = 80
    const lineWidth = 20

    const intersections = {
        first: (viewboxSize - 2 * shift) / 3 + shift,
        second: ((viewboxSize - 2 * shift) / 3) * 2 + shift,
    }


    const recSize = (viewboxSize - 2 * shift) / 3


    const cross = {
        color: '#3989d4',
        spaceAround: 50,
        width: 22
    }

    const circle = {
        color: '#39bcd4',
        radius: 80,
        width: 22
    }

    return <svg viewBox={`0 0 ${viewboxSize} ${viewboxSize}`}>
        <rect x="0" y="0" width={viewboxSize} height={viewboxSize} fill={backgroundColor} />


        <line x1={intersections.first} y1={shift} x2={intersections.first} y2={viewboxSize - shift} stroke="black" strokeWidth={lineWidth} strokeLinecap="round" />
        <line x1={intersections.second} y1={shift} x2={intersections.second} y2={viewboxSize - shift} stroke="black" strokeWidth={lineWidth} strokeLinecap="round" />

        <line x1={shift} y1={intersections.first} x2={viewboxSize - shift} y2={intersections.first} stroke="black" strokeWidth={lineWidth} strokeLinecap="round" />
        <line x1={shift} y1={intersections.second} x2={viewboxSize - shift} y2={intersections.second} stroke="black" strokeWidth={lineWidth} strokeLinecap="round" />

        <line x1={intersections.second + cross.spaceAround} y1={intersections.first - cross.spaceAround} x2={viewboxSize - shift - cross.spaceAround} y2={shift + cross.spaceAround} stroke={cross.color} strokeWidth={cross.width} strokeLinecap="round" />
        <line x1={intersections.second + cross.spaceAround} y1={shift + cross.spaceAround} x2={viewboxSize - shift - cross.spaceAround} y2={intersections.first - cross.spaceAround} stroke={cross.color} strokeWidth={cross.width} strokeLinecap="round" />

        <line x1={intersections.first + cross.spaceAround} y1={intersections.first + cross.spaceAround} x2={intersections.second - cross.spaceAround} y2={intersections.second - cross.spaceAround} stroke={cross.color} strokeWidth={cross.width} strokeLinecap="round" />
        <line x1={intersections.first + cross.spaceAround} y1={intersections.second - cross.spaceAround} x2={intersections.second - cross.spaceAround} y2={intersections.first + cross.spaceAround} stroke={cross.color} strokeWidth={cross.width} strokeLinecap="round" />

        <line x1={intersections.second + cross.spaceAround} y1={viewboxSize - shift - cross.spaceAround} x2={viewboxSize - shift - cross.spaceAround} y2={intersections.second + cross.spaceAround} stroke={cross.color} strokeWidth={cross.width} strokeLinecap="round" />
        <line x1={intersections.second + cross.spaceAround} y1={intersections.second + cross.spaceAround} x2={viewboxSize - shift - cross.spaceAround} y2={viewboxSize - shift - cross.spaceAround} stroke={cross.color} strokeWidth={cross.width} strokeLinecap="round" />


        <circle cx={intersections.first - recSize / 2} cy={viewboxSize / 2} r={circle.radius} stroke={circle.color} strokeWidth={circle.width} fill="transparent" />
        <circle cx={intersections.second + recSize / 2} cy={viewboxSize / 2} r={circle.radius} stroke={circle.color} strokeWidth={circle.width} fill="transparent" />

    </svg>
};

export default MenuTicTacToe