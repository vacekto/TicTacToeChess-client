import { ServerToClientEvents, ClientToServerEvents } from 'shared'
import { io, Socket } from 'socket.io-client'

export type TClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const socketSingleton = function () {
    let _instance: TClientSocket | null = null
    return {
        get instance() {
            if (!_instance) _instance = io("http://localhost:3001")
            return _instance
        }
    }
}()

export const createSocketProxy = (socket: TClientSocket) => {

    const options = {
        _canEmit: true
    }

    const onProxy = new Proxy(socket.on, {
        apply(target, thisArg, args) {
            if (socket.hasListeners(args[0])) return socket
            return Reflect.apply(target, thisArg, args)
        }
    })

    const emitProxy = new Proxy(socket.emit, {
        apply(target, thisArg, args) {
            if (options._canEmit) {
                options._canEmit = false
                Reflect.apply(target, thisArg, args)
                setTimeout(() => {
                    options._canEmit = true
                }, 100)
            }
            return socket
        }
    })

    const socketProxy = new Proxy(socket, {
        get(target, prop: keyof TClientSocket) {
            if (prop === 'on') return onProxy
            if (prop === 'emit') return emitProxy
            return target[prop]
        }
    })

    return socketProxy

}


export default socketSingleton