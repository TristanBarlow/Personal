import { ChessInstance, newBoard, PieceType } from '../../chess'
import { PlayerColour } from '../chessPlayer'
import { shuffle } from '../../../util'
import { MoveResponse, timeTaken } from '../types'

const MINIMAX_VALS: { [key in PieceType]: number } = {
  p: 1,
  r: 5,
  n: 3,
  b: 3,
  q: 9,
  k: 10,
}

export class MiniMacsNode {
  game: ChessInstance
  isDone = false
  moves: string[]
  bestValue = Number.NEGATIVE_INFINITY
  bestMove: string | null = null
  a: number = Number.POSITIVE_INFINITY
  b: number = Number.NEGATIVE_INFINITY
  colour: PlayerColour
  moveCount = 0

  constructor (fen: string) {
    this.game = newBoard(fen)
    this.colour = this.game.turn()
    const moves = this.game.moves()
    this.moves = shuffle(moves)
  }

  NewLayer (depth: number, isMaxing: boolean, a = Number.NEGATIVE_INFINITY, b = Number.POSITIVE_INFINITY): number {
    if (depth === 0) {
      return this.EvaluateBoard()
    }

    let best_move: string | null = null
    const fen = this.game.fen()
    const moves = shuffle(this.game.moves(true))
    let best_value = isMaxing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i]
      this.moveCount++
      if (!this.game.move(move)) {
        console.log("move failed")
      }

      const value = this.NewLayer(depth - 1, !isMaxing, a, b)

      if (isMaxing) {
        if (value > best_value) {
          best_move = move
          best_value = value
        }
        a = Math.max(a, value)
      }
      else {
        if (value < best_value) {
          best_move = move
          best_value = value
        }
        b = Math.min(b, value)
      }

      this.game.load(fen, false)
      if (b <= a) {
        break
      }
    }

    this.bestMove = best_move || moves[0]
    return best_value
  }

  get isMyGo () {
    return this.game.turn() === this.colour
  }

  EvaluateBoard () {
    const board = this.game.board()

    if (this.game.in_checkmate()) {
      return this.isMyGo ? -100 : 100
    }

    let b = 0
    let w = 0
    for (let i = 0; i < board.length; i++)
      for (let y = 0; y < board[i].length; y++) {
        const column = board[i][y]
        if (!column) continue

        const val = MINIMAX_VALS[column.type]
        if (column.color === 'w') w += val
        else b += val
      }

    return this.colour === 'w' ? w - b : b - w
  }

}

export function quickGetMove (fen: string): MoveResponse {
  const node = new MiniMacsNode(fen)
  const strt = performance.now()
  const rating = node.NewLayer(4, true)
  return {
    move: node.bestMove,
    rating,
    details: `Searched ${ node.moveCount } different moves`,
    timeTaken: timeTaken(strt)
  }
}