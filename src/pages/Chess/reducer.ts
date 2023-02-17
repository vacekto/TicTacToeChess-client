import {
    IChessState,
} from 'shared'


export interface IReducerState extends IChessState {
    selected: [number, number] | null
    potentialMoves: [number, number][]
}

export type TChessAction =
    | { type: 'MOVE'; payload: { state: IChessState } }
    | { type: 'INIT_STATE', payload: { state: IChessState } }
    | { type: 'DESELECT' }
    | {
        type: 'SELECT'; payload: {
            coord: [number, number]
            potentialMoves: [number, number][]
        }
    }

const reducer = (prevState: IReducerState, action: TChessAction) => {
    let update = { ...prevState } as IReducerState
    switch (action.type) {
        case 'MOVE':
            update = {
                ...action.payload.state,
                selected: null,
                potentialMoves: []
            }

            return update
        case 'DESELECT':
            update.selected = null
            update.potentialMoves = []
            return update
        case 'SELECT':
            update.selected = action.payload.coord
            update.potentialMoves = action.payload.potentialMoves
            return update
        case 'INIT_STATE':
            update = {
                ...action.payload.state,
                selected: null,
                potentialMoves: [],
            }
            return update
        default:
    }
    throw Error('Unknown reducer action');
}

export default reducer