import { Piece, PiecePosition, PieceType } from "../pieces/piece";

export type BoardState = PieceType[];

export type BoardType = Piece[][];

export enum GameColor {
    WHITE = 'WHITE',
    BLACK = 'BLACK'
}

export const defaultBoardState: PieceType[] = [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2]

enum ColorCodes {
    WHITE = '\u001b[37m',
    RED = '\u001b[31m',
    BLUE = '\u001b[34m'
}

// Since white, black don't work well for terminal program, we will display blue, red instead
const displayMap: Record<PieceType, string> = {
    [0] : `${ColorCodes.WHITE}.`,
    [1]: `${ColorCodes.BLUE}o${ColorCodes.WHITE}`,
    [2]: `${ColorCodes.RED}o${ColorCodes.WHITE}`,
    [3]: `${ColorCodes.BLUE}O${ColorCodes.WHITE}`,
    [4]: `${ColorCodes.RED}O${ColorCodes.WHITE}`
}

export class Board {

    width: number;
    height: number;
    board: BoardType;

    constructor(boardState: BoardState) {
        this.width = 8;
        this.height = 8;
        this.board = boardState.reduce((acc, statePiece, index) => {
            const arrayIndex = acc.length - 1;

            if (acc.length === 0) {
                return [[new Piece(index as PiecePosition, statePiece)]]
            }

            if (acc[arrayIndex].length % this.width === 0) {
                return [...acc, [new Piece(index as PiecePosition, statePiece)]];
            }

            acc[arrayIndex] = [...acc[arrayIndex], new Piece(index as PiecePosition, statePiece)];
            
            return acc;
        }, [] as BoardType);
    }

    displayBoard() {
        console.log(this.board.map((pieceArray) => pieceArray.map((piece) => `${displayMap[piece.pieceType]}`).join(' ')).join('\n'));
    }
}