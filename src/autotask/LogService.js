const log4js = require('log4js');
const { dirname } = require('path');

log4js.configure({
    "appenders": {
        debug: {
            type: "dateFile",
            filename: __dirname + "/Log/debug/debug.log",
        },
        error: {
            type: "dateFile",
            filename: __dirname + "/Log/error/error.log",
        },
        console: {
            type: "console"
        }
    },
    "categories": {
        debug: {
            appenders: ["debug"],
            level: "debug"
        },
        error: {
            appenders: ["error"],
            level: "error"
        },
        default: {
            appenders: ["console"],
            level: "info"
        }
    }
});

const logger = log4js.getLogger();

module.exports = {
    logDebug: function (message) {
        log4js.getLogger("debug").debug(message);
    },
    logError: function (message) {
        log4js.getLogger("error").error(message);
    }
} 