import { ServerToClientEvents, ClientToServerEvents } from 'shared'
import { io, Socket } from 'socket.io-client'

export type TClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export interface ISocketProxy extends TClientSocket {
    connect: (username?: string) => this
}

const socketSingleton = function () {
    let _instance: TClientSocket | null = null
    return {
        get instance() {
            if (_instance) return _instance
            const username = localStorage.getItem('username')
            const options = username ?
                { auth: { username } } :
                { autoConnect: false }

            _instance = io('http://localhost:3001', options)
            return _instance
        },
    }
}()

export const createSocketProxy = (socket: TClientSocket) => {

    const onProxy = new Proxy(socket.on, {
        apply(target, thisArg, args) {
            if (!socket.hasListeners(args[0]))
                return Reflect.apply(target, thisArg, args)
            return socket
        }
    })

    const emitProxy = new Proxy(socket.emit, {
        apply(target, thisArg, args) {
            if (socket.connected)
                return Reflect.apply(target, thisArg, args)
            return socket
        }
    })

    const connectProxy = new Proxy(socket.connect, {
        apply(target, thisArg, args) {
            const username = args[0]
            if (username) socket.auth = { username }
            return Reflect.apply(target, thisArg, [])
        }
    })

    const socketProxy = new Proxy(socket, {
        get(target, prop: keyof TClientSocket, receiver) {
            if (prop === 'on') return onProxy
            if (prop === 'emit') return emitProxy
            if (prop === 'connect') return connectProxy
            return Reflect.get(target, prop, receiver)
        }
    })

    return socketProxy as ISocketProxy

}


export default socketSingleton