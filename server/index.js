require('dotenv').config();
const { app } = require('./app');
const { logger } = require('../utils/logger');
const { dbConnect } = require('../database/index');

const port = process.env.SERVER_PORT || 3000;

dbConnect()
  .then(() => {
    app.listen(port, () => {
      logger.info('== Running on port %d! ==', port);
      logger.info('🚀🚀🚀🚀🚀🚀');
      logger.info('==========');
    });
  })
  .catch((err) => {
    logger.error('DB connection string: mongodb://%s:%d/%s', process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME);
    logger.error('Error starting; Are the parameters in the .env correct? Error: %o', err);
  });
