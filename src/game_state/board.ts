import { Piece, PieceType } from "../pieces/piece";

export type BoardState = PieceType[];

export type BoardType = Piece[];

export enum PlayerColor {
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

const formatDisplaySpacing = (index: number) => {
    if (index === 0) {
        return ''
    }

    if (index % 8 === 0) {
        return '\n'
    }

    return ' '
}

export class Board {

    width: number;
    height: number;
    board: BoardType;

    constructor(boardState: BoardState) {
        this.width = 8;
        this.height = 8;
        this.board = boardState.map((statePiece, index) => new Piece(index, statePiece));
    }

    displayBoard() {
        console.log(this.board.map((piece, index) => `${formatDisplaySpacing(index)}${displayMap[piece.pieceType]}`).join(''));
    }
}