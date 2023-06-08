import { suggestUTicTacToeMove, IUTicTacToeAIMoveProps } from 'shared'


onmessage = (msg) => {

    const props = msg.data as IUTicTacToeAIMoveProps
    let runCb = false
    let move: any = null

    setTimeout(() => {
        if (runCb) postMessage(move)
    }, 1000)

    const start = Date.now()
    move = suggestUTicTacToeMove(props)
    const end = Date.now()
    const elapsedMS = (end - start)

    if (elapsedMS <= 1000) runCb = true
    else postMessage(move)
}