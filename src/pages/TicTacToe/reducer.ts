import {
    ITicTacToeState
} from 'shared'

interface IReducerState extends ITicTacToeState {
    score: {
        X: number
        O: number
        draw: number
    }
}

type TTicTacToeAction =
    | { type: 'STATE_UPDATE'; payload: { state: ITicTacToeState } }

const reducer = (prevState: IReducerState, action: TTicTacToeAction) => {
    let update: IReducerState
    let state: ITicTacToeState
    switch (action.type) {
        case 'STATE_UPDATE':
            state = action.payload.state
            update = {
                ...prevState,
                ...state,
                score: {
                    ...prevState.score
                }
            }
            if (state.winner) {
                update.score[state.winner] = prevState.score[state.winner] + 1
            }
            return update
        default:
    }
    throw Error('Unknown reducer action');
}

export default reducer

