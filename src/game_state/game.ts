import { BoardArrayPosition, BoardPieceIndices, ExecutableMove, Piece, PiecePosition, PieceType } from "../pieces/piece";
import { Board, BoardState } from "./board";
import { Move } from "./move";
import { Player } from "./player";

enum GameEnvironmentType {
    CLI = "CLI",
    WEB = "WEB"
}

enum GameState {
    RUNNING = 'RUNNING',
    WHITE_WON = "WHITE_WON",
    BLACK_WON = "BLACK_WON",
}

export const WHITE_PIECES = [1, 3] as PieceType[]
export const BLACK_PIECES = [2, 4] as PieceType[]

export class Game {

    player1: Player;
    player2: Player;
    board: Board;
    previousBoard: Board;
    currentPlayer: Player;
    gameState: GameState;

    constructor(board: BoardState, player1: Player, player2: Player) {
        this.board = new Board(board);
        this.previousBoard = new Board(board);
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
        this.gameState = GameState.RUNNING;
    }
    
    async startGame() {
        while (this.gameState === GameState.RUNNING) {
            this.board.displayBoard();

            if (this.isGameOver()) {
                continue;
            }

            await this.handlePlayerTurn();

            this.switchTurn();
        }

        // TODO: Display final results
    }

    canMakeMove(move: Move): ExecutableMove | null {
        const selectedPiece = this.board.board[move.from.rank][move.from.file];

        if (selectedPiece?.pieceColor && selectedPiece.pieceColor !== this.currentPlayer.playerColor) {
            return null;
        }

        const possibleMoves = selectedPiece.getPossibleMoves(this.board);

        return possibleMoves.find(({ rank, file }) => rank === move.to.rank && file === move.to.file) ?? null;
    }

    canChainCapture({ rank, file, captureCoordinate }: ExecutableMove) {
        if (!captureCoordinate) return false;

        const selectedPiece = this.board.board[rank][file];

        if (selectedPiece?.pieceColor && selectedPiece.pieceColor !== this.currentPlayer.playerColor) {
            return false;
        }

        const possibleMoves = selectedPiece.getPossibleMoves(this.board);

        return possibleMoves.some(({ captureCoordinate }) => captureCoordinate);
    }

    makeMove(move: Move, { captureCoordinate }: ExecutableMove) {
        const selectedPiece = this.board.board[move.from.rank][move.from.file];

        // maybe consolidate the two next operations into one
        this.board.board[move.to.rank][move.to.file] = selectedPiece;
        selectedPiece.setNewPosition(move.to);

        this.board.board[move.from.rank][move.from.file] = new Piece({ rank: move.from.rank, file: move.from.file }, 0);

        if (captureCoordinate) {
            this.board.board[captureCoordinate.rank][captureCoordinate.file] = new Piece({ rank: captureCoordinate.rank, file: captureCoordinate.file }, 0)
        }
    }

    unmakeMove() {
        // reset board to previous state
        // reset piece position to previous (call unMakeMove on piece)
    }

    async handlePlayerTurn() {
        console.log(`It is ${this.currentPlayer.playerColor}'s turn`);
        let move: Move | null = null;

        move = await this.currentPlayer.getMoveFromPlayer();

        let executableMove = this.canMakeMove(move);

        while (!move || !executableMove) {
            move = await this.currentPlayer.getMoveFromPlayer();

            executableMove = this.canMakeMove(move);
        }

        this.makeMove(move, executableMove);

        if (this.canChainCapture(executableMove)) {
            await this.handlePlayerTurn();
        }
    }

    isGameOver() {
        const whiteInGame = this.board.board.some((pieceArray) => pieceArray.some(({ pieceType }) => WHITE_PIECES.includes(pieceType)));
        const blackInGame = this.board.board.some((pieceArray) => pieceArray.some(({ pieceType }) => BLACK_PIECES.includes(pieceType)));

        if (!whiteInGame) {
            this.gameState = GameState.BLACK_WON;
            return true;
        }

        if (!blackInGame) {
            this.gameState = GameState.WHITE_WON;
            return true;
        }
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer.playerColor === this.player1.playerColor ? this.player2 : this.player1;
    }
}