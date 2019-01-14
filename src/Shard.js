const Server = require('./network/Server');
const logger = require('./logger');
const Config = require('./config');

/**
 * Config
 */
Config.load();

/**
 * Spawn
 */
Server.spawn()
  .then(() => logger.info('Successfully initialized!'))
  .catch(error => logger.error(`Failed to spawn servers.. Reason: ${error.message}`));
