import {
    TGameName,
    TGameSide,
    TGameMode,
    IGameInvite
} from "shared";
import { socketProxy } from '@/util/socketSingleton';


export interface IGlobalState {
    theme: 'light' | 'dark',
    gameSide: TGameSide | ''
    opponentGameSide: TGameSide | ''
    username: string
    opponentUsername: string
    showUsernameModal: boolean
    gameName: TGameName | ''
    gameMode: TGameMode | ''
    usernameErrorMsg: string,
    usersOnline: string[],
    gameInvites: IGameInvite[],
    inviteNotifications: IGameInvite[],
    activeGenericSelectId: string,
};

export type TGlobalStateAction =
    {
        type: 'STATE_UPDATE';
        payload: { stateUpdate: Partial<IGlobalState> }
    }

    | {
        type: 'NEW_GAME_INVITE';
        payload: { invite: IGameInvite }
    }

    | {
        type: 'REMOVE_NOTIFICATION';
        payload: { inviteId: string }
    }
    | {
        type: 'REMOVE_INVITATION';
        payload: { inviteId: string }
    }
    | {
        type: 'PREVIOUS_SELECT_UPDATE';
    }


const reducer = (prevState: IGlobalState, action: TGlobalStateAction) => {
    let notifications: IGameInvite[]
    let gameInvites: IGameInvite[]
    let filtered: IGameInvite[]
    switch (action.type) {
        case 'STATE_UPDATE':

            if (
                prevState.gameMode === 'multiplayer' &&
                !action.payload.stateUpdate.gameMode
            )
                socketProxy.emit('leave_game')

            return {
                ...prevState,
                ...action.payload.stateUpdate
            }

        case 'NEW_GAME_INVITE':
            gameInvites = [...prevState.gameInvites]
            notifications = [...prevState.inviteNotifications]
            const newInvite = action.payload.invite
            const index = prevState.gameInvites.findIndex(inv => {
                return inv.id === newInvite.id
            })
            if (index === -1) {
                gameInvites.push(newInvite)
                notifications.push(newInvite)
            }
            return {
                ...prevState,
                gameInvites,
                notifications
            }

        case 'REMOVE_NOTIFICATION':
            notifications = [...prevState.inviteNotifications]
            filtered = notifications.filter(invite => {
                return invite.id !== action.payload.inviteId
            })
            return {
                ...prevState,
                inviteNotifications: filtered,
            }

        case 'REMOVE_INVITATION':
            const id = action.payload.inviteId
            gameInvites = [...prevState.gameInvites]
            filtered = gameInvites.filter(invite => {
                return invite.id !== id
            })
            return {
                ...prevState,
                gameInvites
            }

        case 'PREVIOUS_SELECT_UPDATE':
            return {
                ...prevState,
                previousGenericSelectId: prevState.activeGenericSelectId,
                activeGenericSelectId: ''
            }
        default:
            throw Error('Unknown reducer action');
    }
}

export default reducer