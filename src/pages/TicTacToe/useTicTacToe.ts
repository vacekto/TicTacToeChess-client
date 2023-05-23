import { useRef, useContext } from "react"
import { context } from "@/context/GlobalStateProvider"
import { TicTacToeGame, ITicTacToeMove, TTicTacToeSide } from "shared"
import { socketProxy } from "@/util/socketSingleton"

const useTicTacToe = () => {
    const {
        gameMode,
        updateGlobalState,
        gameSide,
        ticTacToeBoardSize,
        ticTacToeWinCondition
    } = useContext(context)


    const instance = useRef(new TicTacToeGame(
        ticTacToeBoardSize,
        ticTacToeWinCondition,
        gameSide === '' ? undefined : gameSide as TTicTacToeSide
    ))

    const moveProxy = new Proxy(instance.current.move, {
        apply(target, thisArg, args) {
            const move = args[0] as ITicTacToeMove
            if (gameMode === 'multiplayer')
                socketProxy.emit('game_move', move)

            if (gameMode === 'hotseat') {
                updateGlobalState({
                    gameSide: gameSide === 'X' ? 'O' : 'X'
                })
            }

            return Reflect.apply(target, thisArg, args)
        }
    })


    const isntanceProxy = new Proxy(instance.current, {
        get(target, prop, receiver) {
            if (prop === 'move') return moveProxy
            return Reflect.get(target, prop, receiver)
        }
    })

    return isntanceProxy

}

export default useTicTacToe