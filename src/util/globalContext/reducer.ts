import {
    TGameName,
    TGameSide,
    TGameMode,
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
    usersOnline: string[]
};

export type TGlobalStateAction = {
    type: 'STATE_UPDATE';
    payload: { stateUpdate: Partial<IGlobalState> }
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
        default:
    }
    throw Error('Unknown reducer action');
}

export default reducer