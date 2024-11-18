import { pino } from 'npm:pino';
import pretty from 'npm:pino-pretty';
import Signale from 'npm:signale';

const stream = pretty({
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
    // minimumLevel: "error",
});

export const Logger = pino({}, stream);

export const Console = new Signale.Signale({});

Console.config({
    displayFilename: false,
    displayTimestamp: true,
    displayDate: false,
    displayBadge: false,
    displayLabel: true,
    displayScope: true,
    uppercaseLabel: true,
    underlineLabel: false,
});
