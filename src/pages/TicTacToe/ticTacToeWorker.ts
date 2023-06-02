import { suggestTicTacToeMove, ITicTacToeAIMoveProps } from 'shared'


onmessage = (msg) => {
    const props = msg.data as ITicTacToeAIMoveProps
    const move = suggestTicTacToeMove(props)
    postMessage(move)
}

export { }