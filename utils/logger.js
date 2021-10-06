module.exports.logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });
