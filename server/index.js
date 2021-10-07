require('dotenv').config();
const { app } = require('./app');
const { logger } = require('../utils/logger');
const { dbConnect } = require('../database/index');

const port = 3000;

dbConnect()
  .then(() => {
    app.listen(port, () => {
      logger.info('== Running on port ', port, '! ==');
      logger.info('🚀🚀🚀🚀🚀🚀');
      logger.info('==========');
    });
  });
