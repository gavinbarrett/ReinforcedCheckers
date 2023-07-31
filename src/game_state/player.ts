import * as readline from 'readline'
import { GameColor } from "./board";
import { Move } from './move'
import { BoardArrayPosition, PiecePosition } from '../pieces/piece';

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
        let fromRank;
        let fromFile;
        let toRank;
        let toFile;
        let fromCoords;
        let toCoords;
        let fromRankNumber: BoardArrayPosition | null = null;
        let fromFileNumber: BoardArrayPosition | null = null;
        let toRankNumber: BoardArrayPosition | null = null;
        let toFileNumber: BoardArrayPosition | null = null;

        let move: string = await this.getPrompt();

        [fromCoords, toCoords] = move.split(' ');

        [fromRank, fromFile] = fromCoords.split(',');
        [toRank, toFile] = toCoords.split(',');

        fromRankNumber = Number(fromRank) as BoardArrayPosition;
        fromFileNumber = Number(fromFile) as BoardArrayPosition;
        toRankNumber = Number(toRank) as BoardArrayPosition;
        toFileNumber = Number(toFile) as BoardArrayPosition;

        // while (!isValidMoveSet(fromNumber, toNumber)) {
        //     move = await this.getPrompt();

        //     console.log('Move', move);
        //     [from, to] = move.split(',');

            // fromNumber = Number(from) as PiecePosition;
            // toNumber = Number(to) as PiecePosition;
        // }

        if (!Number.isInteger(fromRankNumber) || !Number.isInteger(toRankNumber) || !Number.isInteger(fromFileNumber) || !Number.isInteger(toFileNumber)) {
            throw Error('Numbers not valid');
        }

        return { 
            from: {
                rank: fromRankNumber,
                file: fromFileNumber
            },
            to: {
                rank: toRankNumber,
                file: toFileNumber
            } 
        }

    };
}