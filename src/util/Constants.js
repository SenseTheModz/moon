/**
 * Process events
 * @enum
 */
const PROCESS_EVENTS = {
  SERVER_ADD: 0,
  PLAYER_JOINED: 1,
  PLAYER_LEFT: 2,
  UPDATE_SERVER: 3,
};

/**
 * Connection state
 * @enum
 */
const CONNECTION_STATE = {
  IDLE: 0,
  CONNECTED: 1,
  DISCONNECTED: 2,
};

/**
 * Network protocol type
 * @enum
 */
const PROTOCOL_TYPE = {
  AQW: 'aqw',
  AQ3D: 'aq3d',
};

module.exports = { PROCESS_EVENTS, CONNECTION_STATE, PROTOCOL_TYPE };
