import {
    IChessState,
} from 'shared'


export interface IReducerState extends IChessState {
    selected: [number, number] | null
    potentialMoves: [number, number][]
}

export type TChessAction =
    | { type: 'STATE_UPDATE'; payload: { state: IChessState } }
    | { type: 'DESELECT' }
    | {
        type: 'SELECT'; payload: {
            coord: [number, number]
            potentialMoves: [number, number][]
        }
    }

const reducer = (prevState: IReducerState, action: TChessAction) => {
    let update: IReducerState
    switch (action.type) {
        case 'STATE_UPDATE':
            update = {
                ...prevState,
                ...action.payload.state,
                selected: null,
                potentialMoves: []
            }

            return update
        case 'DESELECT':
            update = { ...prevState }
            update.selected = null
            update.potentialMoves = []
            return update
        case 'SELECT':
            update = { ...prevState }
            update.selected = action.payload.coord
            update.potentialMoves = action.payload.potentialMoves
            return update
        default:
    }
    throw Error('Unknown reducer action');
}

export default reducer