import {
    IUTicTacToeState,
} from 'shared'

interface IReducerState extends IUTicTacToeState {
    score: {
        X: number
        O: number
        draw: number
    }
}

type TUTicTacToeAction =
    | { type: 'STATE_UPDATE'; payload: { state: IUTicTacToeState } }
    | { type: 'STATE_RESET'; payload: { state: IUTicTacToeState } }


const reducer = (prevState: IReducerState, action: TUTicTacToeAction) => {
    let update = { ...prevState }
    switch (action.type) {
        case 'STATE_UPDATE':
            const stateUpdate = action.payload.state
            update = {
                ...prevState,
                ...stateUpdate,
                score: {
                    ...prevState.score
                }
            }
            if (stateUpdate.winner) {
                update.score[stateUpdate.winner] = prevState.score[stateUpdate.winner] + 1
            }
            return update

        case 'STATE_RESET':
            update = {
                ...action.payload.state,
                score: {
                    X: 0,
                    O: 0,
                    draw: 0
                }
            }
            return update
    }
}

export default reducer