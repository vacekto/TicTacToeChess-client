import {
    IUTicTacToeState,
    initUTicTacToeState,
    checkForWinnerUTicTacToe,
    checkForWinnerTicTacToe,
} from 'shared'

export type TTicTacToeAction =
    | { type: 'HOTSEAT_MOVE'; payload: { moveCOORD: [number, number, number, number] } }
    | { type: 'RESET_STATE' }

const reducer = (prevState: IUTicTacToeState, action: TTicTacToeAction) => {
    let update = { ...prevState }
    switch (action.type) {
        case 'HOTSEAT_MOVE':
            const [SX, SY, X, Y] = action.payload.moveCOORD
            update.board[SX][SY][X][Y] = prevState.activePlayer
            const segmentState = checkForWinnerTicTacToe(prevState.board[SX][SY], 3, [X, Y])
            update.segmentBoard[SX][SY] = segmentState.winner
            const gameState = checkForWinnerUTicTacToe(update.board)
            if (prevState.segmentBoard[X][Y]) update.activeSegment = null
            else update.activeSegment = [X, Y]
            if (gameState.winner) {
                update.winner = gameState.winner
                update.score = { ...prevState.score }
                update.score[gameState.winner] = prevState.score[gameState.winner] + 1
            }
            update.activePlayer = prevState.activePlayer === 'O' ? 'X' : 'O'
            return update
        case 'RESET_STATE':
            return initUTicTacToeState()
        default:
    }
    throw Error('Unknown action ');

}

export default reducer