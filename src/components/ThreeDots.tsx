import './ThreeDots.scss'

interface IThreeDotsProps {
    size?: 'small' | 'medium' | 'large'
}

const ThreeDots: React.FC<IThreeDotsProps> = ({ size = 'medium' }) => {
    return <div className={`ThreeDots`}>
        <div className={`ThreeDotsContainer ${size}`}>
            <div className='first'></div>
            <div className='second'></div>
            <div className='third'></div>
        </div>
    </div>

}

export default ThreeDots