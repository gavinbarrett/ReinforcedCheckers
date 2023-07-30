import * as readline from 'readline'
import { GameColor } from "./board";
import { Move } from './move'
import { PiecePosition } from '../pieces/piece';

const prompter = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export interface Player {
    playerColor: GameColor;
    getPrompt: () => Promise<string>;
    getMoveFromPlayer: () => Promise<Move>;
}

const isValidMoveSet = (fromNumber: number | null, toNumber: number | null) => fromNumber && toNumber && (0 <= fromNumber && fromNumber <= 63) && (0 <= toNumber && toNumber <= 63);


// TODO: also create WebPlayer, which receives inputs over a network
// and AI player, which will use the system's AI player to play against the user

export class CLIPlayer implements Player {
    playerColor: GameColor;

    constructor(playerColor: GameColor) {
        this.playerColor = playerColor;
    }

    async getPrompt() {
        return new Promise((r: (value: string) => void) => prompter.question('What is your move? ', r));
    }

    async getMoveFromPlayer() {
        let from;
        let to;
        let fromNumber: PiecePosition | null = null;
        let toNumber: PiecePosition | null = null;

        let move: string = await this.getPrompt();

        [from, to] = move.split(',');
        fromNumber = Number(from) as PiecePosition;
        toNumber = Number(to) as PiecePosition;

        // while (!isValidMoveSet(fromNumber, toNumber)) {
        //     move = await this.getPrompt();

        //     console.log('Move', move);
        //     [from, to] = move.split(',');

            // fromNumber = Number(from) as PiecePosition;
            // toNumber = Number(to) as PiecePosition;
        // }

        if (!Number.isInteger(fromNumber) || !Number.isInteger(toNumber)) {
            throw Error('Numbers not valid');
        }

        console.log('Found valid moves', move);

        return { from: fromNumber as PiecePosition, to: toNumber as PiecePosition }

    };
}