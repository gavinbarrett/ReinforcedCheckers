import { PieceType } from "../pieces/piece";
import { Board, BoardState } from "./board";
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

const WHITE_PIECES = [1, 3] as PieceType[]
const BLACK_PIECES = [2, 4] as PieceType[]

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

            this.checkIfGameOver();

            const move = await this.currentPlayer.getMoveFromPlayer();

            // make move if available

            this.switchTurn();
        }
    }

    canMakeMove() {}

    makeMove() {}

    unmakeMove() {
        // reset board to previous state
        // reset piece position to previous (call unMakeMove on piece)
    }

    checkIfGameOver() {
        const whiteInGame = this.board.board.some(({ pieceType }) => WHITE_PIECES.includes(pieceType));
        const blackInGame = this.board.board.some(({ pieceType }) => BLACK_PIECES.includes(pieceType));

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