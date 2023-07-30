import * as readline from 'readline'
import { PlayerColor } from "./board";

const prompter = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export interface Player {
    playerColor: PlayerColor
    getMoveFromPlayer: () => Promise<unknown>
}

export class CLIPlayer implements Player {
    playerColor: PlayerColor;

    constructor(playerColor: PlayerColor) {
        this.playerColor = playerColor;
    }

    async getMoveFromPlayer() {
        console.log('Getting move');
        return new Promise((r) => {
            console.log('Calling');
            return prompter.question('What is your move? ', r);
        });
    };
}