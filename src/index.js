const Web = require('./web');
const Config = require('./config');
const logger = require('./logger');
const Process = require('./process');
const path = require('path');
const Util = require('./util');

Util.dumpAsciiLogo();


/**
 * Config
 */
Config.load();


/**
 * Process
 */
const process = new Process(path.join(__dirname, '.', 'Shard.js'));

/**
 * Web server object
 */
const { port, enabled } = Config.get('web');

/**
 * Web server
 */
if (enabled) Web(port).then(() => logger.info('Web Server Initialized...'));

/**
 * Spawn process
 */
process.spawn()
  .then(() => logger.info('Sharding proxy server...'))
  .catch(error => logger.error(`Failed Initializing! Reason: ${error.message}`));
