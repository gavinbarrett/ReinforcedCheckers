import { PiecePosition, PieceType } from "../pieces/piece";
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
        this.board.displayBoard();

        this.checkIfGameOver();

        await this.handlePlayerTurn();

        this.switchTurn();

        // while (this.gameState === GameState.RUNNING) {
        //     // TODO: displayBoard should push the new board state to a web client for web type player
        //     this.board.displayBoard();

        //     this.checkIfGameOver();

        //     this.handlePlayerTurn();

        //     this.switchTurn();
        // }
    }

    getPieceAtPosition(position: number) {
        const quotient = Math.floor(position / this.board.width) as PiecePosition;
        const remainder = position % this.board.width as PiecePosition;

        return this.board.board[quotient][remainder];
    }

    canMakeMove(move: Move) {
        const selectedPiece = this.getPieceAtPosition(move.from);

        if (selectedPiece?.pieceColor && selectedPiece.pieceColor !== this.currentPlayer.playerColor) {
            return false;
        }

        // TODO: call getPossibleMoves
        const possibleMoves = selectedPiece.getPossibleMoves(this.board);
    }

    makeMove() {
        // update board state and piece position
    }

    unmakeMove() {
        // reset board to previous state
        // reset piece position to previous (call unMakeMove on piece)
    }

    async handlePlayerTurn() {
        let move: Move | null = null;

        move = await this.currentPlayer.getMoveFromPlayer();

        // while (!canMove) {
        //     move = await this.currentPlayer.getMoveFromPlayer();

        //     console.log('Calling canmakemove');
        //     canMove = this.canMakeMove(move) ?? false;
        // }
        const canMove = this.canMakeMove(move) ?? false;
        // make move if available
    }

    checkIfGameOver() {
        const whiteInGame = this.board.board.some((pieceArray) => pieceArray.map(({ pieceType }) => WHITE_PIECES.includes(pieceType)));
        const blackInGame = this.board.board.some((pieceArray) => pieceArray.map(({ pieceType }) => BLACK_PIECES.includes(pieceType)));

        if (!whiteInGame) {
            this.gameState = GameState.BLACK_WON;
        }

        if (!blackInGame) {
            this.gameState = GameState.WHITE_WON;
        }
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer.playerColor === this.player1.playerColor ? this.player2 : this.player1;
    }
}