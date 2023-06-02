import { useRef, useContext } from "react"
import { context } from "@/context/GlobalStateProvider"
import { UTicTacToeGame, IUTicTacToeMove, TTicTacToeSide } from "shared"
import { socketProxy } from "@/util/socketSingleton"

const useUTicTacToe = () => {
    const {
        gameMode,
        updateGlobalState,
        gameSide,
    } = useContext(context)


    const instance = useRef(new UTicTacToeGame(gameSide ? gameSide as TTicTacToeSide : undefined))

    const moveProxy = new Proxy(instance.current.move, {
        apply(target, thisArg, args) {
            const move = args[0] as IUTicTacToeMove
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

export default useUTicTacToe