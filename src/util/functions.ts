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
    app.addEventListener('mousedown', mouseDownHandler)
    app.dragToScrollRegistered = true

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



export const subscribeToSocketEvents: TSubscribeToSocketEvents = (updateGlobalState, socket) => {
    socket.on('username_accepted', (username) => {
        const stateUpdate: Partial<IGlobalState> = {}
        stateUpdate.showUsernameModal = false
        stateUpdate.username = username
        updateGlobalState(stateUpdate)
    })

    socket.on('username_denied', (errorMessage) => {
        const stateUpdate: Partial<IGlobalState> = {}
        stateUpdate.showUsernameModal = true
        stateUpdate.username = ''
        stateUpdate.usernameErrorMsg = errorMessage
        updateGlobalState(stateUpdate)
    })

    socket.on('start_game', (gameName, opponentUsername, gameSide) => {
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

    socket.on('connect_error', (err) => {
        console.log(err.message)

        const stateUpdate: Partial<IGlobalState> = {}

        stateUpdate.showUsernameModal = true
        stateUpdate.username = ''
        stateUpdate.usernameErrorMsg = err.message

        updateGlobalState(stateUpdate)
    })
}

export const handleMenuResize = (element: HTMLDivElement) => {
    const gameOptions = Array.from(document.getElementsByClassName('GameOption')) as HTMLDivElement[]

    const observer = new ResizeObserver(entries => {
        const div = entries[0]
        gameOptions.forEach(option => {
            option.style.width = div.contentRect.width < 560 ? '150px' : '180px'
        })
    })

    observer.observe(element)
}