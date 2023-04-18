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
    if (app.dataset.dragToScroll === 'actives') return
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    app.addEventListener('mousedown', mouseDownHandler)
    app.setAttribute('data-dragToScroll', 'active')

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

    socket.on('online_users_update', users => {
        updateGlobalState({ usersOnline: users })
    })

    socket.on('game_invites_update', invites => {
        updateGlobalState({ gameInvites: invites })
    })
    socket.on('invite_declined', invite => {
        console.log('invite declined: ' + invite)
    })
    socket.on('game_invite', handleNewInvite)

    socket.on('invite_expired', () => {
        console.log('invite expired')
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
            if (parent.dataset.componentName === 'generic-select') {
                return
            }
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

