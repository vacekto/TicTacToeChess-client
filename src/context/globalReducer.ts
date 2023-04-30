import {
    TGameName,
    TGameSide,
    TGameMode,
    IGameInvite
} from "shared";

export interface IGameInviteWithTimestamp extends IGameInvite {
    timestamp: number
}


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
    gameInvites: IGameInviteWithTimestamp[],
    inviteNotifications: IGameInviteWithTimestamp[],
    activeGenericSelectId: string,
};

export type TGlobalStateAction =
    {
        type: 'STATE_UPDATE';
        payload: { stateUpdate: Partial<IGlobalState> }
    } |

    {
        type: 'NEW_INVITATION';
        payload: { invite: IGameInviteWithTimestamp }
    } |

    {
        type: 'REMOVE_INVITATION';
        payload: { invite: IGameInviteWithTimestamp }
    } |
    {
        type: 'REMOVE_NOTIFICATION';
        payload: { invite: IGameInviteWithTimestamp }
    }



const reducer = (prevState: IGlobalState, action: TGlobalStateAction) => {
    let update = { ...prevState } as IGlobalState
    let index: number
    let invite: IGameInviteWithTimestamp
    switch (action.type) {
        case 'STATE_UPDATE':

            update = {
                ...update,
                ...action.payload.stateUpdate
            }

            return update

        case 'NEW_INVITATION':
            invite = action.payload.invite
            index = prevState.gameInvites.findIndex(inv => {
                return (
                    invite.game === inv.game &&
                    invite.invitee === inv.invitee &&
                    invite.sender === inv.sender
                )
            })

            if (index !== -1) return update

            update.gameInvites = [...prevState.gameInvites]
            update.gameInvites.push(invite)
            update.inviteNotifications = [...prevState.inviteNotifications]
            update.inviteNotifications.push(invite)

            return update

        case 'REMOVE_INVITATION':
            invite = action.payload.invite
            update.gameInvites = [...prevState.gameInvites]
            index = prevState.gameInvites.findIndex(inv => {
                return (
                    invite.game === inv.game &&
                    invite.invitee === inv.invitee &&
                    invite.sender === inv.sender
                )
            })

            if (index !== -1) update.gameInvites.splice(index, 1)

            return update

        case 'REMOVE_NOTIFICATION':
            invite = action.payload.invite
            index = prevState.inviteNotifications.findIndex(inv => {
                return (
                    invite.game === inv.game &&
                    invite.invitee === inv.invitee &&
                    invite.sender === inv.sender
                )
            })
            if (index === -1) return update

            update.inviteNotifications = [...prevState.inviteNotifications]
            update.inviteNotifications.splice(index, 1)

            return update

        default:
            throw Error('Unknown reducer action');
    }
}

export default reducer