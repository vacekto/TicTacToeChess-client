import { useRef } from "react";
import {
    TGameInstance,
    TGameName,
    ChessGame,
    TicTacToeGame,
    UTicTacToeGame,
} from "shared";


type TUseGame = (
    game: TGameName,
    size?: number,
    winCondition?: number,
    startingPlayer?: 'O' | 'X'
) => { gameInstance: TGameInstance }



const useGame: TUseGame = (game, size = 12, winCondition = 5, startingPlayer = 'O') => {
    let gameRef: React.MutableRefObject<TGameInstance | null> = useRef(null)

    if (!gameRef.current) {
        switch (game) {
            case 'chess':
                gameRef.current = new ChessGame()
                break;
            case 'ticTacToe':
                gameRef.current = new TicTacToeGame(size!, winCondition!, startingPlayer!)
                break;
            case 'uTicTacToe':
                gameRef.current = new UTicTacToeGame(startingPlayer!)
                break;
        }
    }
    return { gameInstance: gameRef.current }
}

export default useGame