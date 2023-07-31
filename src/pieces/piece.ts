import { Board, GameColor } from "../game_state/board";
import { WHITE_PIECES } from "../game_state/game";

export const EMPTY_BOARD_SPACE = 0

export type PieceType = typeof EMPTY_BOARD_SPACE | 1 | 2 | 3 | 4;

export type BoardPieceIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63;

export type BoardArrayPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export type PiecePosition = {
    rank: BoardArrayPosition;
    file: BoardArrayPosition;
}

export interface PieceInterface {
    position: PiecePosition;
    previousPosition: PiecePosition;
    pieceType: PieceType;
    pieceColor: GameColor | null;
    isKing: boolean;
    getPosition: () => PiecePosition;
}
function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}
const DOWN_MOVES = [[-1, 1], [1, 1]];
const UP_MOVES = [[-1, -1], [1, -1]];

export class Piece implements PieceInterface {

    position: PiecePosition;
    previousPosition: PiecePosition;
    pieceType: PieceType;
    pieceColor: GameColor | null;
    isKing: boolean;

    constructor(initialPosition: PiecePosition, pieceType: PieceType) {
        this.position = initialPosition;
        this.previousPosition = this.position;
        this.pieceType = pieceType;
        this.pieceColor = pieceType === 0 ? null : WHITE_PIECES.includes(pieceType) ? GameColor.WHITE : GameColor.BLACK;
        this.isKing = false;
    }

    becomeKing() {
        this.isKing = true;
    }

    getPosition() {
        return this.position;
    }

    setNewPosition(position: PiecePosition) {
        this.position = position;
    }

    getKingMoveOffset() {

    }

    getPossibleMoves(board: Board) {
        return [...(this.pieceColor === GameColor.WHITE ? DOWN_MOVES : UP_MOVES), ...(this.isKing ? this.pieceColor === GameColor.WHITE ? UP_MOVES : DOWN_MOVES : [])].map(([rankOffset, fileOffset]) => {

            const rankSum = this.position.rank + rankOffset;
            const fileSum = this.position.file + fileOffset;

            // bounds check
            if (rankSum < 0 || rankSum > 7 || fileSum < 0 || fileSum > 7) {
                return null;
            }

            // check that no other piece is there
            if (!board.board[rankSum][fileSum] || board.board[rankSum][fileSum].pieceType !== EMPTY_BOARD_SPACE) {
                return null;
            }
            console.log('Pass piece check');


            return [rankSum, fileSum];
        }).filter((isDefined))
    }

    unMakeMove() {
        this.position = this.previousPosition;
    }
}