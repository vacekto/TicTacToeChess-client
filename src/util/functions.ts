import { IGameInvite, TGameSide } from 'shared'
import { IGlobalState } from '../context/globalReducer'
import { TClientSocket } from './socketSingleton'

type TRegisterGenericSelectTracker = (
    updateGlobalState: (stateUpdate: Partial<IGlobalState>,) => void,
) => void

type TSubscribeToSocketEvents = (
    socket: TClientSocket,
    updateGlobalState: (stateUpdate: Partial<IGlobalState>,) => void,
    handleNewInvite: (newInvite: IGameInvite) => void
) => void


export const registerDragToScroll = () => {
    const app = document.getElementsByClassName('App')[0] as HTMLElement
    if (app.dataset.dragToScroll === 'active') return
    app.dataset.dragToScroll = 'active'
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    app.addEventListener('mousedown', mouseDownHandler)

    function mouseDownHandler(e: any) {
        pos = {
            left: app.scrollLeft,
            top: app.scrollTop,
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    function mouseMoveHandler(e: any) {
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;
        app.scrollTop = pos.top - dy;
        app.scrollLeft = pos.left - dx;
    };


    function mouseUpHandler() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
}




export const subscribeToSocketEvents: TSubscribeToSocketEvents = (socket, updateGlobalState, handleNewInvite) => {
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

    socket.on('start_game', (
        gameName,
        opponentUsername,
        ticTacToeBoardSize,
        ticTacToeWinCondition
    ) => {
        updateGlobalState({
            gameName,
            opponentUsername,
            gameMode: 'multiplayer',
            ticTacToeBoardSize,
            ticTacToeWinCondition
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

    socket.on('online_users_update', users => {
        updateGlobalState({ usersOnline: users })
    })

    socket.on('game_invite', handleNewInvite)

    socket.on('disconnect', () => {
        updateGlobalState({
            gameName: '',
            gameMode: '',
            gameSide: '',
        })
    })
}


export const trackActiveGenericSelect: TRegisterGenericSelectTracker = (updateGlobalState) => {
    const app = document.getElementsByClassName('App')[0] as HTMLElement
    if (app.dataset.genericSelectTracker === 'active') return
    app.dataset.genericSelectTracker = 'active'

    app.addEventListener('click', (e) => {
        if (!(e.target instanceof Element)) return
        let parent = e.target.parentElement

        while (parent && !(parent instanceof Document)) {
            if (parent.dataset.componentName === 'generic-select') return
            parent = parent.parentElement
        }

        updateGlobalState({
            activeGenericSelectId: ''
        })
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