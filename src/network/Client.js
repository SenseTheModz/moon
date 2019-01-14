const IncomingHandlerManager = require('./handlers/IncomingHandlerManager');
const OutgoingHandlerManager = require('./handlers/OutgoingHandlerManager');
const { CONNECTION_STATE } = require('../util/Constants');
const PromiseSocket = require('promise-socket');
const Delimiter = require('./delimiter');
const Packet = require('./protocol/packets');
const Protocol = require('./protocol');
const Player = require('../game/Player');
const State = require('../game/State');

class Client {
  constructor(server, socket) {
    /**
     * Server that instantiated this client
     * @type {TCPServer}
     * @public
     */
    this.server = server;

    /**
     * Socket that instantiated this client
     * @type {net.Socket}
     * @private
     */
    this._socket = socket;
    this._socket.setEncoding('utf-8');

    /**
     * Remote connection
     * @type {?net.Socket}
     * @private
     */
    this._remote = null;

    /**
     * Connection state
     * @type {number}
     * @public
     */
    this.state = CONNECTION_STATE.IDLE;

    /**
     * Local packet delimiter
     * @type {string}
     * @private
     */
    this._localDelimiter = new Delimiter();
    this._localDelimiter.on('packet', packet => this._onPacket(Client.type.LOCAL, packet));

    /**
     * Remote packet delimiter
     * @type {string}
     * @private
     */
    this._remoteDelimiter = new Delimiter();
    this._remoteDelimiter.on('packet', packet => this._onPacket(Client.type.REMOTE, packet));

    /**
     * Incoming packet handler
     * @type {IncomingHandlerManager}
     * @private
     */
    this._incomingManager = new IncomingHandlerManager(this);

    /**
     * Incoming packet handler
     * @type {OutgoingHandlerManager}
     * @private
     */
    this._outgoingManager = new OutgoingHandlerManager(this);

    /**
     * Client state store
     * @type {State}
     * @public
     */
    this.state = new State();

    /**
     * Player of this client
     * @type {?Player}
     * @public
     */
    this.player = null;
  }

  /**
   * Connection type
   * @returns {Object}
   * @readonly
   */
  static get type() {
    return {
      LOCAL: 0,
      REMOTE: 1,
    };
  }

  /**
   * Message types
   * @returns {Object}
   * @readonly
   */
  get messageType() {
    return {
      zone: 'zone',
      moderator: 'moderator',
      server: 'server',
      warning: 'warning',
      general: 'general',
    };
  }

  /**
   * Creates a new player instance
   * @param {Object} information Information of the player
   * @param {string} token Authentication token of the player
   */
  constructPlayer(information) {
    if (this.player === null) this.player = new Player(this, information);
  }

  /**
   * Sends a moderator server message
   * @param {type} type Message type
   * @param {sring} message Message to send
   * @returns {Promise<void>}
   */
  serverMessage(type, message) {
    type = this.messageType[type];
    return this.writeToLocal(`%xt%${type}%-1%${message}%`);
  }

  /**
   * Attempts connection to the remote host
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      this._remote = new PromiseSocket();
      this._remote.setEncoding('utf-8');

      const { host, port } = this.server.remote;
      await this._remote.connect({ host, port });
      this._state = CONNECTION_STATE.CONNECTED;

      this._init();
      this._remote.stream.on('data', data => this._remoteDelimiter.chuck(data));
      this._remote.stream.once('close', () => this.disconnect());
    } catch (error) {
      this.server.logger.error(`Failed connecting to the remote host.. Reason: ${error.message}`);
    }
  }

  /**
   * Initialize the socket events
   * @private
   */
  _init() {
    this._socket.stream.on('data', data => this._localDelimiter.chuck(data));
    this._socket.stream.once('close', () => this.disconnect());
  }

  /**
   * Handles incoming  packets
   * @param {number} type Incoming/outgoing type
   * @param {string} packet Outgoing packet
   */
  _onPacket(type, packet) {
    const toPacket = Protocol.constructPacket(packet);
    if (toPacket) {
      toPacket.parse();

      if (type === Client.type.LOCAL) {
        this.server.plugins.fireLocalHooks(this, toPacket);
        this._outgoingManager.handle(toPacket);
      } else {
        this._incomingManager.handle(toPacket);
        this.server.plugins.fireRemoteHooks(this, toPacket);
      }

      if (toPacket.send) {
        if (type === Client.type.LOCAL) this.writeToRemote(toPacket);
        else this.writeToLocal(toPacket);
      }
    }
  }

  /**
   * Sends the packet to the server
   * @param {Packet} packet Packet to send
   * @returns {Promise<void>}
   * @public
   */
  async writeToRemote(packet) {
    if (this._state === CONNECTION_STATE.CONNECTED) {
      try {
        let toPacket = packet instanceof Packet ? packet.toPacket() : packet;
        if (typeof toPacket === 'object') toPacket = JSON.stringify(toPacket);

        if (this.server.debug) this.server.logger.info(`[Client] ${toPacket}`, { server: this.server.name });
        await this._remote.write(`${toPacket}\x00`);
      } catch (error) {
        this.server.logger.error(`Remote send failed! Reason: ${error.message}`, { server: this.server.name });
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
    if (this._state === CONNECTION_STATE.CONNECTED) {
      try {
        let toPacket = packet instanceof Packet ? packet.toPacket() : packet;
        if (typeof toPacket === 'object') toPacket = JSON.stringify(toPacket);

        if (this.server.debug) this.server.logger.info(`[Remote] ${toPacket}`, { server: this.server.name });
        await this._socket.write(`${toPacket}\x00`);
      } catch (error) {
        this.server.logger.error(`Local send failed! Reason: ${error.message}`, { server: this.server.name });
      }
    }
  }

  /**
   * Handles disconnection
   * @public
   */
  async disconnect() {
    if (this._state === CONNECTION_STATE.CONNECTED) {
      this._state = CONNECTION_STATE.DISCONNECTED;
      await this._remote.end();
      await this._socket.end();
      await this._destroy();
      this.server.removeConnection(this);
    }
  }

  /**
   * Distorys the sockets
   * @private
   */
  async _destroy() {
    await this._remote.destroy();
    await this._socket.destroy();
  }
}

module.exports = Client;
