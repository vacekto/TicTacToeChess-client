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
    let update = { ...prevState }
    switch (action.type) {
        case 'STATE_UPDATE':
            const state = action.payload.state
            update = {
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

// import {
//     IChessState,
// } from 'shared'


// export interface IReducerState extends IChessState {
//     selected: [number, number] | null
//     potentialMoves: [number, number][]
// }

// export type TChessAction =
//     | { type: 'STATE_UPDATE'; payload: { state: IChessState } }
//     | { type: 'INIT_STATE', payload: { state: IChessState } }
//     | { type: 'DESELECT' }
//     | {
//         type: 'SELECT'; payload: {
//             coord: [number, number]
//             potentialMoves: [number, number][]
//         }
//     }

// const reducer = (prevState: IReducerState, action: TChessAction) => {
//     let update = { ...prevState } as IReducerState
//     switch (action.type) {
//         case 'STATE_UPDATE':
//             update = {
//                 ...action.payload.state,
//                 selected: null,
//                 potentialMoves: []
//             }

//             return update
//         case 'DESELECT':
//             update.selected = null
//             update.potentialMoves = []
//             return update
//         case 'SELECT':
//             update.selected = action.payload.coord
//             update.potentialMoves = action.payload.potentialMoves
//             return update
//         case 'INIT_STATE':
//             update = {
//                 ...action.payload.state,
//                 selected: null,
//                 potentialMoves: [],
//             }
//             return update
//         default:
//     }
//     throw Error('Unknown reducer action');
// }

// export default reducer