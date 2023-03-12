import {
    TGameName,
    TGameSide,
    TGameMode,
} from "shared";


export interface IGlobalState {
    theme: 'light' | 'dark',
    gameSide: TGameSide | ''
    opponentGameSide: TGameSide | ''
    username: string
    opponentUsername: string
    showUsernameModal: boolean
    gameName: TGameName | ''
    gameMode: TGameMode | ''
    usernameErrorMsg: string
};

export type TGlobalStateAction = {
    type: 'STATE_UPDATE';
    payload: { stateUpdate: Partial<IGlobalState> }
}


const reducer = (prevState: IGlobalState, action: TGlobalStateAction) => {
    switch (action.type) {
        case 'STATE_UPDATE':
            return {
                ...prevState,
                ...action.payload.stateUpdate
            }
        default:
    }
    throw Error('Unknown reducer action');
}

export default reducer