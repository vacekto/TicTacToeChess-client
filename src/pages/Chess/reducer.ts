import {
    checkForWinnerTicTacToe,
    initTicTacToeState,
    ITicTacToeState
} from 'shared'

// tady bude instance hry

export type TTicTacToeAction =
    | { type: 'HOTSEAT_MOVE'; payload: { moveCOORD: { X: number, Y: number } } }
    | { type: 'RESET_STATE' }

const reducer = (prevState: ITicTacToeState, action: TTicTacToeAction) => {
    let update = { ...prevState }
    switch (action.type) {
        case 'HOTSEAT_MOVE':
            const { X, Y } = action.payload.moveCOORD
            update.board[X][Y] = prevState.currentlyPlaying
            const gameState = checkForWinnerTicTacToe(update.board, 5, [X, Y])
            if (gameState.winner) {
                update.winner = gameState.winner
                update.score = { ...prevState.score }
                update.score[gameState.winner] = prevState.score[gameState.winner] + 1
            }
            update.currentlyPlaying = prevState.currentlyPlaying === 'O' ? 'X' : 'O'
            return update
        case 'RESET_STATE':
            return initTicTacToeState()
        default:
    }
    throw Error('Unknown reducer action');
}

export default reducer