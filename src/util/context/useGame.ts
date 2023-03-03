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
    // size: number,
    // winCondition: number
) => TGameInstance



const useGame: TUseGame = (game) => {
    let gameRef: React.MutableRefObject<TGameInstance | null> = useRef(null)

    if (!gameRef.current) {
        switch (game) {
            case 'chess':
                gameRef.current = new ChessGame()
                break;
            case 'ticTacToe':
                gameRef.current = new TicTacToeGame(3, 3, 'O')
                break;
            case 'uTicTacToe':
                gameRef.current = new UTicTacToeGame('O')
                break;
        }
    }
    return gameRef.current
}

export default useGame