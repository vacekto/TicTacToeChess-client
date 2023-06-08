import { suggestUTicTacToeMove, IUTicTacToeAIMoveProps } from 'shared'
const { aiMove } = require('js-chess-engine')

onmessage = (msg) => {
    const fen = msg.data as IUTicTacToeAIMoveProps
    let runCb = false
    let move: any = null

    setTimeout(() => {
        if (runCb) postMessage(move)
    }, 1000)

    const start = Date.now()
    move = aiMove(fen, 3)

    const end = Date.now()
    const elapsedMS = (end - start)

    if (elapsedMS <= 1000) runCb = true
    else postMessage(move)
}