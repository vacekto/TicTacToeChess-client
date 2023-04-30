import { ReactComponent as bk } from '@/util/svg/plain/BKing.svg'
import { ReactComponent as bq } from '@/util/svg/plain/BQueen.svg'
import { ReactComponent as br } from '@/util/svg/plain/BRook.svg'
import { ReactComponent as bb } from '@/util/svg/plain/BBishop.svg'
import { ReactComponent as bn } from '@/util/svg/plain/BKnight.svg'
import { ReactComponent as bp } from '@/util/svg/plain/BPawn.svg'

import { ReactComponent as wk } from '@/util/svg/plain/WKing.svg'
import { ReactComponent as wq } from '@/util/svg/plain/WQueen.svg'
import { ReactComponent as wr } from '@/util/svg/plain/WRook.svg'
import { ReactComponent as wb } from '@/util/svg/plain/WBishop.svg'
import { ReactComponent as wn } from '@/util/svg/plain/WKnight.svg'
import { ReactComponent as wp } from '@/util/svg/plain/WPawn.svg'
import { TChessPiece } from 'shared'

const pieces = {
    bk,
    bq,
    br,
    bb,
    bn,
    bp,
    wk,
    wq,
    wr,
    wb,
    wn,
    wp,
    ee: null
}

interface IChessPieceProps {
    piece: TChessPiece
    style?: React.CSSProperties
}

const ChessPiece: React.FC<IChessPieceProps> = ({ style, piece }) => {
    const Component = pieces[piece]
    return Component ? <Component style={style} /> : null
}

export default ChessPiece