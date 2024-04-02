import MySQLTransport from "winston-mysql";
import "winston-daily-rotate-file";
import { createLogger, format, transports } from "winston";
import { DB_CONNECTION, DB_HOST, DB_NAME, DB_TABLE } from "./config.mjs";
import { sequelize } from "./models/index.js";
const { combine, json, splat, timestamp } = format;

const { username, password } = DB_CONNECTION;

//database
const db_options = {
    host: DB_HOST,
    user: username,
    password: password,
    database: DB_NAME,
    table: DB_TABLE,
};

//logger
const logger = createLogger({
    format: combine(timestamp(), splat(), json()),
});

const consoleW = new transports.Console({
    level: "debug",
});

const rotate = new transports.DailyRotateFile({
    filename: "./logs/combined-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "5d",
    createSymlink: true,
    symlinkName: 'combined.log'
});

if (process.env.ENV) {
    try {
        await sequelize.authenticate();
        const logsDB = new MySQLTransport(db_options, {
            level: "info",
        });
        logger.add(rotate).add(consoleW).add(logsDB);
    } catch (error) {
        console.error(error);
        logger.add(rotate).add(consoleW);
    }
} else {
    logger.add(rotate).add(consoleW);
}

export const writeError = (msg) => {
    logger.error(msg);
};

export const infoLog = (msg) => {
    logger.info(msg);
};

export const warningLog = (msg) => {
    logger.warn(msg);
};