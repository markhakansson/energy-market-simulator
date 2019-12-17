const { createLogger, format, transports } = require('winston');
const fs = require('fs');
require('winston-daily-rotate-file');

const logDir = '../logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const options = {
    error: {
        level: 'error',
        filename: '../logs/error.log',
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
    }
}

/**
 * Winston logger. Usage:
 * 'logger.debug('debug message') to log debug messages to the console.
 * 'logger.error('error message') to log error message to console and to file.
 */
const logger = createLogger({
    transports: [
        new transports.File(options.error),
        new transports.Console(options.debug)
    ]
});

module.exports = logger;
