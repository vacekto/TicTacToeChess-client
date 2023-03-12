import { useRef } from "react";
import {
    TGameInstance,
    TGameName,
    ChessGame,
    TicTacToeGame,
    UTicTacToeGame,
    TGameMode,
} from "shared";


type TUseGame = (
    gameName: TGameName,
    gameMode: TGameMode,
    size?: number,
    winCondition?: number,
    startingPlayer?: 'O' | 'X'
) => { gameInstance: TGameInstance }


const createGameProxy = (game: TGameInstance, gameMode: TGameMode) => {
    const moveProxy = new Proxy(game.move, {
        apply(target, thisArg, args) {
            if (gameMode === 'multiplayer') {

                // socket work
            }
            Reflect.apply(target, thisArg, args)
        }
    })

    const gameProxy = new Proxy(game, {
        get(target, prop: keyof TGameInstance, receiver) {
            if (prop === 'move') return moveProxy
            return Reflect.get(target, prop, receiver)
        }
    })

    return gameProxy
}

const useGame: TUseGame = (game, gameMode, size = 12, winCondition = 5, startingPlayer = 'O') => {
    let gameRef: React.MutableRefObject<TGameInstance | null> = useRef(null)
    if (gameRef.current) return { gameInstance: gameRef.current }

    let gameInstance: TGameInstance

    if (game === 'chess') gameInstance = new ChessGame()
    if (game === 'ticTacToe') gameInstance = new TicTacToeGame(size!, winCondition!, startingPlayer!)
    if (game === 'uTicTacToe') gameInstance = new UTicTacToeGame(startingPlayer!)

    const gameProxy = createGameProxy(gameInstance!, gameMode)
    gameRef.current = gameProxy

    return { gameInstance: gameProxy }
}

export default useGame