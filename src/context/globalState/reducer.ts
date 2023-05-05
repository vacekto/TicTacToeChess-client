import {
    TGameName,
    TGameSide,
    TGameMode,
    IGameInvite,
} from "shared";
import { socketProxy } from '@/util/socketSingleton';
import { act } from "@testing-library/react";


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
    gameInvites: IGameInvite[]
};

export type TGlobalStateAction =
    | {
        type: 'STATE_UPDATE';
        payload: { stateUpdate: Partial<IGlobalState> }
    }

    | {
        type: 'NEW_INVITE';
        payload: { invite: IGameInvite }
    }


const reducer = (prevState: IGlobalState, action: TGlobalStateAction) => {
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

        case 'NEW_INVITE':
            return {
                ...prevState,
                gameInvites: [...prevState.gameInvites, action.payload.invite]
            }
        default:
    }
    throw Error('Unknown reducer action');
}

export default reducer