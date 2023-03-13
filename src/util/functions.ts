import { TGameSide } from 'shared'
import { IGlobalState } from './globalContext/reducer'
import { TClientSocket } from './socketSingleton'

interface myApp extends HTMLElement {
    dragToScrollRegistered?: boolean
}

type TInitUsernameFromStorage = (
    updateGlobalState: (stateUpdate: Partial<IGlobalState>,) => void,
    socket: TClientSocket
) => void

type TSubscribeToSocketEvents = TInitUsernameFromStorage

export const registerDragToScroll = (app: myApp) => {
    if (app.dragToScrollRegistered) return
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    app.dragToScrollRegistered = true
    app.addEventListener('mousedown', mouseDownHandler)

    function mouseDownHandler(event: any) {
        pos = {
            left: app.scrollLeft,
            top: app.scrollTop,
            x: event.clientX,
            y: event.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    function mouseMoveHandler(event: any) {
        const dx = event.clientX - pos.x;
        const dy = event.clientY - pos.y;
        app.scrollTop = pos.top - dy;
        app.scrollLeft = pos.left - dx;
    };


    function mouseUpHandler() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
}



export const initUsernameFromStorage: TInitUsernameFromStorage = (updateGlobalState, socket) => {
    const stateUpdate: Partial<IGlobalState> = {}

    const username = localStorage.getItem('username');
    if (!username) {
        stateUpdate.showUsernameModal = true
        updateGlobalState(stateUpdate)
        return
    }
    socket.emit('setUsername', username)
}

export const subscribeToSocketEvents: TSubscribeToSocketEvents = (updateGlobalState, socket) => {
    socket.on('setUsername', (status, message, username) => {
        const stateUpdate: Partial<IGlobalState> = {}

        if (status === 'error') {
            stateUpdate.usernameErrorMsg = message
            stateUpdate.showUsernameModal = true
            stateUpdate.username = ''
            updateGlobalState(stateUpdate)
            return
        }

        stateUpdate.showUsernameModal = false
        stateUpdate.username = username
        updateGlobalState(stateUpdate)
    })

    socket.on('startGame', (gameName, opponentUsername, gameSide) => {

        const opponentGameSide: TGameSide = gameName === 'chess' ?
            (gameSide === 'w' ? 'b' : 'w') :
            (gameSide === 'O' ? 'X' : 'O')

        updateGlobalState({
            gameName,
            opponentUsername,
            gameMode: 'multiplayer',
            opponentGameSide,
            gameSide
        })
    })

}