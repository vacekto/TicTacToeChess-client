import { ChessGame } from 'shared';
import { useRef, useContext } from 'react'



const useChess = () => {
    const gameInstance = useRef(new ChessGame())

    const gameProxy = useRef((() => {
        const moveProxy = new Proxy(gameInstance.current.move, {
            apply(target, thisArg, args) {
                // socket work and such..

                return Reflect.apply(target, thisArg, args)
            }
        })

        const gameProxy = new Proxy(gameInstance.current, {
            get(target, prop, receiver) {
                if (prop === 'move') return moveProxy
                return Reflect.get(target, prop, receiver)
            }
        })

        return gameProxy

    })())




    return gameProxy.current
}

export default useChess