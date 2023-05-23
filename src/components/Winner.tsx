import './Winner.scss'
import { TGameSide } from "shared"
import { useContext } from 'react'
import { context } from "@/context/GlobalStateProvider"
import { socketProxy } from "@/util/socketSingleton"
import CrossSVG from '@/util/svg/components/CrossSVG'
import CircleSVG from '@/util/svg/components/CircleSVG'
import ChessPiece from '@/util/svg/components/ChessPiece'


interface IWinnerProps {
    winner: TGameSide | 'draw',
    resetCb: () => void
}

const Winner: React.FC<IWinnerProps> = ({ winner, resetCb }) => {
    const { leaveGame, gameMode } = useContext(context)


    const playAgain = () => {
        if (gameMode === 'multiplayer') {
            socketProxy.emit('play_again')
        }
        else resetCb()
    }

    return <div className="Winner">
        <div className={`outcome ${winner}`}>
            {function () {
                if (winner === 'O') return <><CircleSVG />wins</>
                if (winner === 'X') return <><CrossSVG /> wins!</>
                if (winner === 'b') return <><ChessPiece piece='bq' />wins!</>
                if (winner === 'w') return <><ChessPiece piece='wq' />wins!</>
                if (winner === 'draw') return 'It`s a draw'
            }()}
        </div>
        <div className="actions">
            <button className="customButton" onClick={playAgain}>play again</button>
            <button className="customButton" onClick={leaveGame}>main menu</button>
        </div>
    </div>
}

export default Winner