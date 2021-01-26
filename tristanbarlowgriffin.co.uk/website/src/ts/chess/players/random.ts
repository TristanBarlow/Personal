import { ChessPlayer } from './chessPlayer'
import { newBoard } from '../chess'
import { PlayersTypes, MoveResponse, timeTaken } from './types'


export class RandomBot extends ChessPlayer {
  name = PlayersTypes.RANDOM
  isHuman = false
  lastNumberOfMoves = 0

  async getMove(fen: string): Promise<MoveResponse | null> {
    const strt = performance.now()
    const game = newBoard(fen)
    const possibleMoves = game.moves()
    this.lastNumberOfMoves = possibleMoves.length
    if (possibleMoves.length <= 0) return null

    const randomIndex = Math.floor(Math.random() * possibleMoves.length)
    const move = possibleMoves[randomIndex]
    return { move, rating: 1, timeTaken: timeTaken(strt), details: 'I picked randomly' }
  }

  get stats() {
    return `I Had ${this.lastNumberOfMoves} I could do, I picked randomly because I am an Idiot`
  }
}
