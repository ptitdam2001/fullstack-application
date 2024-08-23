import chalk from 'chalk';
import winston from 'winston';

const colorize = winston.format((info) => {
    const level = info.level;
    const color =
      level === "error"
        ? chalk.red
        : level === "warn"
        ? chalk.yellow
        : level === "info"
        ? chalk.green
        : chalk.white;
    info.message = color(info.message);
    return info;
  });

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(colorize(), winston.format.simple()),
    transports: [new winston.transports.Console()],
  });