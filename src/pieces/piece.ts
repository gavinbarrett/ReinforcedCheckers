export type PieceType = 0 | 1 | 2 | 3 | 4;

export type PiecePosition = number;

export interface PieceInterface {
    position: PiecePosition;
    pieceType: PieceType;
    isKing: boolean;
    getPosition: () => PiecePosition;
}

export class Piece {

    position: PiecePosition;
    previousPosition: PiecePosition;
    pieceType: PieceType;
    isKing: boolean;

    constructor(position: PiecePosition, pieceType: PieceType) {
        this.position = position;
        this.previousPosition = this.position;
        this.pieceType = pieceType;
        this.isKing = false;
    }

    becomeKing() {
        this.isKing = true;
    }

    getPosition() {
        return this.position;
    }

    unMakeMove() {
        this.position = this.previousPosition;
    }
}