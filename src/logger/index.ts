import pino from 'pino';
import pretty from 'pino-pretty';
import { Signale } from 'signale';

const stream = pretty({
  colorize: true,
  ignore: 'pid,hostname',
  translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
  // minimumLevel: "error",
});

export const log = pino({}, stream);

const debug = new Signale({});
debug.config({
  displayFilename: false,
  displayTimestamp: true,
  displayDate: false,
  displayBadge: true,
  displayLabel: true,
  displayScope: true,
  uppercaseLabel: true,
  underlineLabel: false,
});

export { debug };
