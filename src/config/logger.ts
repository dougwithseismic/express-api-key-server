// @@filename: src/config/logger.ts
import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, align } = winston.format;

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  verbose: "cyan",
  debug: "white",
  silly: "gray",
};

winston.addColors(colors);

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // align(),
  printf((info) => {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp.slice(0, 19).replace("T", " ");
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
    }`;
  })
);

const fileFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // align(),
  printf((info) => {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp.slice(0, 19).replace("T", " ");
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
    }`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels: logLevels,
  format: fileFormat,
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
    }),
  ],
});

export { logger };
