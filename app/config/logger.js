const { createLogger, format, transports } = require('winston');
const rootPath = require('app-root-path');
const fs = require('fs');
require('winston-daily-rotate-file');

const logDir = rootPath + '/logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

let logger;

const prodOptions = {
    error: {
        level: 'error',
        filename: rootPath + '/logs/%DATE%-error.log',
        dataPattern: 'YYYY-MM-DD',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            })
        )
    },
    warn: {
        level: 'warn',
        filename: rootPath + '/logs/%DATE%-warning.log',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            })
        )
    }
}

const devOptions = {
    error: {
        level: 'error',
        filename: rootPath + '/logs/%DATE%-error.log',
        dataPattern: 'YYYY-MM-DD',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(error => `${error.timestamp} ${error.level}: ${error.message}`)
        )
    },
    debug: {
        level: 'debug',
        format: format.combine(
            format.colorize(),
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(debug => `${debug.timestamp} ${debug.level}: ${debug.message}`)
        )
    },
    warn: {
        level: 'warn',
        filename: rootPath + '/logs/%DATE%-warning.log',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(warn => `${warn.timestamp} ${warn.level} ${warn.message}`)
        )
    }
}

/**
 * Winston logger. Usage:
 * 'logger.debug('debug message') to log debug messages to the console.
 * 'logger.error('error message') to log error message to console and to file.
 */
if (process.env.NODE_ENV === 'production') {
    logger = createLogger({
        transports: [
            new transports.DailyRotateFile(prodOptions.error),
            new transports.DailyRotateFile(prodOptions.warn)
        ]
    });
} else {
    logger = createLogger({
        transports: [
            new transports.DailyRotateFile(devOptions.error),
            new transports.Console(devOptions.debug),
            new transports.DailyRotateFile(devOptions.warn)
        ]
    });
}

module.exports = logger;
