const { PACKET_EVENTS } = require('../../util/Constants');

class IncomingHandlerManager {
  constructor(client) {
    /**
     * Client that instantiated this manager
     * @type {Client}
     * @public
     */
    this.client = client;

    /**
     * Incoming packet handlers
     * @type {Object}
     * @private
     */
    this._handlers = {};

    /**
     * Register handlers
     */
    this._register(PACKET_EVENTS.LOGIN_RESPONSE, require('./incoming/LoginResponse.js'));
  }

  /**
   * Registers a handler
   * @param {string} event Packet event type
   * @param {Handler} handler Handler to register
   * @private
   */
  _register(event, handler) {
    this._handlers[event] = new handler(this);
  }

  /**
   * Handles incoming packets
   * @param {Packet} packet Incoming packet
   */
  handle(packet) {
    if (this._handlers[packet.type]) this._handlers[packet.type].handle(packet);
  }
}

module.exports = IncomingHandlerManager;

