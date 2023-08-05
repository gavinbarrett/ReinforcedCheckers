import { Board, GameColor } from "../game_state/board";
import { BLACK_PIECES, WHITE_PIECES } from "../game_state/game";

export const EMPTY_BOARD_SPACE = 0

export type PieceType = typeof EMPTY_BOARD_SPACE | 1 | 2 | 3 | 4;

export type BoardPieceIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63;

export type BoardArrayPosition = number;

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
    getPossibleMoves(board: Board): ExecutableMove[]; 
}

function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

enum MoveSetType {
    MOVE = 'MOVE',
    CAPTURE = 'CAPTURE'
}

export type PieceOffsetPosition = {
    rankMoveOffset: BoardArrayPosition;
    fileMoveOffset: BoardArrayPosition;
    type: MoveSetType.MOVE;
} | {
    rankMoveOffset: BoardArrayPosition;
    fileMoveOffset: BoardArrayPosition;
    rankCaptureOffset: BoardArrayPosition;
    fileCaptureOffset: BoardArrayPosition;
    type: MoveSetType.CAPTURE;
}

const DOWN_MOVES: PieceOffsetPosition[] = [
    { rankMoveOffset: 1, fileMoveOffset: -1, type: MoveSetType.MOVE },
    { rankMoveOffset: 1, fileMoveOffset: 1, type: MoveSetType.MOVE },
    { rankMoveOffset: 2, fileMoveOffset: -2, rankCaptureOffset: 1, fileCaptureOffset: -1, type: MoveSetType.CAPTURE },
    { rankMoveOffset: 2, fileMoveOffset: 2, rankCaptureOffset: 1, fileCaptureOffset: 1, type: MoveSetType.CAPTURE }
];

const UP_MOVES: PieceOffsetPosition[] = [
    { rankMoveOffset: -1, fileMoveOffset: 1, type: MoveSetType.MOVE },
    { rankMoveOffset: -1, fileMoveOffset: -1, type: MoveSetType.MOVE },
    { rankMoveOffset: -2, fileMoveOffset: 2, rankCaptureOffset: -1, fileCaptureOffset: 1, type: MoveSetType.CAPTURE },
    { rankMoveOffset: -2, fileMoveOffset: -2, rankCaptureOffset: -1, fileCaptureOffset: -1, type: MoveSetType.CAPTURE },
];

export type ExecutableMove = PiecePosition & { captureCoordinate: PiecePosition | null }

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

        // if (!this.isKing) {
            
        // }

        // TODO: if piece isn't a king and landed on the other side of the board, promote them
    }

    getKingMoveOffset() {

    }

    getPossibleMoves(board: Board): ExecutableMove[] {
        return [...(this.pieceColor === GameColor.WHITE ? DOWN_MOVES : UP_MOVES), ...(this.isKing ? this.pieceColor === GameColor.WHITE ? UP_MOVES : DOWN_MOVES : [])].map((moveSet) => {

            const rankMoveSum = this.position.rank + moveSet.rankMoveOffset;
            const fileMoveSum = this.position.file + moveSet.fileMoveOffset;

            // bounds check
            if (rankMoveSum < 0 || rankMoveSum > 7 || fileMoveSum < 0 || fileMoveSum > 7) {
                return null;
            }

            if (moveSet.type === MoveSetType.CAPTURE) {
                const rankCaptureSum = this.position.rank + moveSet.rankCaptureOffset;
                const fileCaptureSum = this.position.file + moveSet.fileCaptureOffset;

                if (!(this.pieceColor === GameColor.WHITE ? BLACK_PIECES : WHITE_PIECES).includes(board.board[rankCaptureSum][fileCaptureSum].pieceType)) {
                    return null;
                }
            }

            // check that no other piece is there
            if (board.board[rankMoveSum][fileMoveSum].pieceType !== EMPTY_BOARD_SPACE) {
                return null;
            }

            return {
                rank: rankMoveSum,
                file: fileMoveSum,
                captureCoordinate: moveSet.type === MoveSetType.CAPTURE ?
                    {
                        rank: this.position.rank + moveSet.rankCaptureOffset,
                        file: this.position.file + moveSet.fileCaptureOffset,
                    }
                : null,
            };
        }).filter((isDefined))
    }

    unMakeMove() {
        this.position = this.previousPosition;
    }
}