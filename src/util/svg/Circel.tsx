import './Circle.css'

interface ICircleProps {

}

const Circle: React.FC<ICircleProps> = (props) => {

    return <svg >
        <circle cx="50" cy="50" r="30" stroke="black" strokeWidth="6" fill="transparent" />
    </svg>;
};

export default Circle;