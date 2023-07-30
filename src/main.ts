import { PlayerColor, defaultBoardState } from "./game_state/board";
import { Game } from "./game_state/game";
import { CLIPlayer } from "./game_state/player";


const runGameLoop = async () => {
    const player1 = new CLIPlayer(PlayerColor.WHITE);
    const player2 = new CLIPlayer(PlayerColor.BLACK);

    const game = new Game(defaultBoardState, player1, player2);

    await game.startGame();
}

runGameLoop();