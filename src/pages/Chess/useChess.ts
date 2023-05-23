import { useRef, useContext } from "react"
import { context } from "@/context/GlobalStateProvider"
import { ChessGame, IChessMove } from "shared"
import { socketProxy } from "@/util/socketSingleton"

const useChess = () => {
    const instance = useRef(new ChessGame()).current
    const { gameMode, updateGlobalState, gameSide } = useContext(context)

    const moveProxy = new Proxy(instance.move, {
        apply(target, thisArg, args) {
            const move = args[0] as IChessMove
            if (gameMode === 'multiplayer')
                socketProxy.emit('game_move', move)

            if (gameMode === 'hotseat') {
                updateGlobalState({
                    gameSide: gameSide === 'b' ? 'w' : 'b'
                })
            }

            return Reflect.apply(target, thisArg, args)
        }
    })


    const isntanceProxy = new Proxy(instance, {
        get(target, prop, receiver) {
            if (prop === 'move') return moveProxy
            return Reflect.get(target, prop, receiver)
        }
    })

    return isntanceProxy

}

export default useChess