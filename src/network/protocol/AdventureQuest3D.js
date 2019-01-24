const { CONNECTION_STATE, ADVENTUREQUEST_3D_PACKETS } = require('../../util/Constants');
const JsonPacket = require('./packets/aq3d/JsonPacket');
const xor = require('../encryption/Xor');
const Packet = require('./packets');
const Protocol = require('./');

class AdventureQuest3D extends Protocol {
  constructor(client) {
    super(client);

    /**
     * Local handlers
     */
    this.regsiterLocalHandler(ADVENTUREQUEST_3D_PACKETS.LOGIN, require('./handlers/aq3d/local/Login'));

    /**
     * Remote handlers
     */
    this.regsiterRemoteHandler(ADVENTUREQUEST_3D_PACKETS.AREA, require('./handlers/aq3d/remote/Area'));
    this.regsiterRemoteHandler(ADVENTUREQUEST_3D_PACKETS.CELL, require('./handlers/aq3d/remote/Cell'));
  }

  /**
   * Constructs the local packet
   * @param {string} packet Packet to construct
   * @returns {Packet}
   * @public
   */
  constructPacket(packet) {
    packet = packet.substr(2);
    return new JsonPacket(packet);
  }

  /**
   * Called on incoming/outgoing packet
   * @param {number} type Packet type
   * @param {string} packet Packet to handle
   * @public
   */
  onPacket(type, packet) {
    packet = xor(packet).toString();
    this.parseAndFire(type, packet);
  }

  /**
   * Writes to the remote connection
   * @param {any} packet Packet to write
   * @returns {Promise<void>}
   * @public
   */
  async remote(packet) {
    if (this.client.connectionState === CONNECTION_STATE.CONNECTED) {
      try {
        const toPacket = packet instanceof Packet ? packet.toPacket() : JSON.stringify(packet);
        if (this.client.server.debug) this.logger.info(`[Client] ${toPacket}`, { server: this.client.server.name });

        const bufferPacket = this._toBufferPacket(toPacket, packet.type, packet.cmd);
        await this.client.remote.write(bufferPacket);
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
  async local(packet) {
    if (this.client.connectionState === CONNECTION_STATE.CONNECTED) {
      try {
        const toPacket = packet instanceof Packet ? packet.toPacket() : JSON.stringify(packet);
        if (this.client.server.debug) this.logger.info(`[Remote] ${toPacket}`, { server: this.client.server.name });

        const bufferPacket = this._toBufferPacket(toPacket, packet.type, packet.cmd);
        await this.client.socket.write(bufferPacket);
      } catch (error) {
        this.logger.error(`Local send failed! Reason: ${error.message}`, { server: this.client.server.name });
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
    const array = Buffer.alloc(packet.length + 3);
    array[0] = type;
    array[1] = cmd;
    packet.copy(array, 2);
    xor(array);
    array[packet.length + 2] = 0;
    return array;
  }
}

module.exports = AdventureQuest3D;
