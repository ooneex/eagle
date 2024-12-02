import pretty, { PrettyStream } from 'npm:pino-pretty@13.0.0';
import { Logger as Log, pino } from 'npm:pino@9.5.0';
import Signale from 'npm:signale@1.4.0';

/**
 * Pretty print stream configuration for Pino logger
 * Colorizes output and formats timestamps
 */
const stream: PrettyStream = pretty({
  colorize: true,
  ignore: 'pid,hostname',
  translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
  // minimumLevel: "error",
});

/**
 * Configured Pino logger instance with pretty printing
 */
export const Logger: Log = pino({}, stream);

/**
 * Configured Signale logger instance for console output
 */
export const Console: Signale = new Signale.Signale({});

/**
 * Signale display configuration
 * Customizes timestamp and label display
 */
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
