const { CONNECTION_STATE, PROTOCOL_TYPE } = require('../../util/Constants');
const xor = require('../encryption/Xor');
const Delimiter = require('../delimiter');
const Packet = require('./packets');

class Protocol {
  constructor(client) {
    /**
     * Client that instantiated this protocol
     * @type {Client}
     * @public
     */
    this.client = client;

    /**
     * Local handlers
     * @type {Object}
     * @protected
     */
    this.localHandlers = {};

    /**
     * Remote handlers
     * @type {Object}
     * @protected
     */
    this.remoteHandlers = {};

    /**
     * Local packet delimiter
     * @type {string}
     * @public
     */
    this.localDelimiter = new Delimiter();
    this.localDelimiter.on('packet', packet => this.onPacket(this.type.LOCAL, packet));

    /**
     * Remote packet delimiter
     * @type {string}
     * @public
     */
    this.remoteDelimiter = new Delimiter();
    this.remoteDelimiter.on('packet', packet => this.onPacket(this.type.REMOTE, packet));
  }

  /**
   * Returns the logger instance
   * @readonly
   */
  get logger() {
    return this.client.server.logger;
  }

  /**
   * Connection type
   * @returns {Object}
   * @readonly
   */
  get type() {
    return {
      LOCAL: 0,
      REMOTE: 1,
    };
  }

  /**
   * Packet types
   * @returns {Object}
   * @readonly
   */
  get packetType() {
    return {
      XML: 0,
      XT: 1,
      JSON: 2,
      UNDEFINED: 3,
    };
  }

  /**
   * Handles incoming/outgoing packets
   * @param {number} type Packet type
   * @param {Packet} packet Incoming/outgoing packet
   */
  handle(type, packet) {
    switch (type) {
      case this.type.LOCAL:
        if (this.localHandlers[packet.type]) this.localHandlers[packet.type].handle(packet);
        break;

      case this.type.REMOTE:
        if (this.remoteHandlers[packet.type]) this.remoteHandlers[packet.type].handle(packet);
        break;
    }
  }


  /**
   * Sends the packet to the server
   * @param {Packet} packet Packet to send
   * @returns {Promise<void>}
   * @public
   */
  async writeToRemote(packet) {
    if (this.client.connectionState === CONNECTION_STATE.CONNECTED) {
      try {
        let toPacket = packet instanceof Packet ? packet.toPacket() : packet;
        if (typeof toPacket === 'object') toPacket = JSON.stringify(toPacket);
        if (this.client.server.debug) this.logger.info(`[Client] ${toPacket}`, { server: this.client.server.name });

        // eslint-disable-next-line max-len
        if (this.client.server.protocol === PROTOCOL_TYPE.AQ3D) toPacket = this._toBufferPacket(toPacket, packet.type, packet.cmd);
        this.client.remote.write(toPacket);
        await this.client.remote.write('\x00');
      } catch (error) {
        this.logger.error(`Remote send failed! Reason: ${error.message}`, { server: this.client.server.name });
      }
    }
  }

  /**
   * Sends the packet to the server
   * @param {Packet} packet Packet to send
   * @returns {Promise<void>}
   * @public
   */
  async writeToLocal(packet) {
    if (this.client.connectionState === CONNECTION_STATE.CONNECTED) {
      try {
        let toPacket = packet instanceof Packet ? packet.toPacket() : packet;
        if (typeof toPacket === 'object') toPacket = JSON.stringify(toPacket);
        if (this.client.server.debug) this.logger.info(`[Remote] ${toPacket}`, { server: this.client.server.name });

        // eslint-disable-next-line max-len
        if (this.client.server.protocol === PROTOCOL_TYPE.AQ3D) toPacket = this._toBufferPacket(toPacket, packet.type, packet.cmd);
        this.client.socket.write(toPacket);
        await this.client.socket.write('\x00');
      } catch (error) {
        this.logger.error(`Local send failed! Reason: ${error.message}`, { server: this.client.server.name });
      }
    }
  }

  /**
   * Handles incoming  packets and fires the events
   * @param {number} type Incoming/outgoing type
   * @param {string} packet Outgoing packet
   */
  parseAndFire(type, packet) {
    const toPacket = this.constructPacket(packet);

    if (toPacket) {
      toPacket.parse();

      this.handle(type, toPacket);

      if (type === this.type.LOCAL) this.client.server.plugins.fireLocalHooks(this.client, toPacket);
      else this.client.server.plugins.fireRemoteHooks(this.client, toPacket);

      if (toPacket.send) {
        if (type === this.type.LOCAL) this.writeToRemote(toPacket);
        else this.writeToLocal(toPacket);
      }
    }
  }

  /**
   * Creates a packet buffer and encodes the packet
   * @param {any} packet Packet to buffer
   * @param {number} type Packet type
   * @param {number} cmd Packet command
   * @returns {Buffer}
   * @private
   */
  _toBufferPacket(packet, type = 255, cmd = 255) {
    packet = Buffer.from(packet);
    const array = Buffer.alloc(packet.length + 2);
    array[0] = type;
    array[1] = cmd;
    packet.copy(array, 2);
    return xor(array);
  }

  /**
   * Regsiters a local handler
   * @param {string|number} event Event type
   * @param {Handler} handler Handler to regsiter
   */
  regsiterLocalHandler(event, handler) {
    this.localHandlers[event] = new handler(this);
  }

  /**
   * Regsiters a remote handler
   * @param {string|number} event Event type
   * @param {Handler} handler Handler to regsiter
   */
  regsiterRemoteHandler(event, handler) {
    this.remoteHandlers[event] = new handler(this);
  }

  /**
   * Constructs the local packet
   * @param {string} packet Packet to construct
   * @abstract
   */
  constructPacket() {
    throw new Error('Method not implemented.');
  }

  /**
   * Called on incoming/outgoing packet
   * @param {string} packet Packet to handle
   * @public
   */
  onPacket() {
    throw new Error('Method not implemented.');
  }
}

module.exports = Protocol;
