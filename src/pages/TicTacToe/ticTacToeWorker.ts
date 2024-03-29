import { suggestTicTacToeMove, ITicTacToeAIMoveProps } from 'shared'


onmessage = (msg) => {

    const props = msg.data as ITicTacToeAIMoveProps
    props.skill = 3
    let runCb = false
    let move: any = null

    setTimeout(() => {
        if (runCb) postMessage(move)
    }, 1000)

    const start = Date.now()
    move = suggestTicTacToeMove(props)
    const end = Date.now()
    const elapsedMS = (end - start)

    if (elapsedMS <= 1000) runCb = true
    else postMessage(move)
}