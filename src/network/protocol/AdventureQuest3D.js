const { CONNECTION_STATE } = require('../../util/Constants');
const xor = require('../encryption/Xor');
const JsonPacket = require('./packets/aq3d/JsonPacket');
const Packet = require('./packets');
const Protocol = require('./');

class AdventureQuest3D extends Protocol {
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
  async writeToRemote(packet) {
    if (this.client.state === CONNECTION_STATE.CONNECTED) {
      try {
        const toPacket = packet instanceof Packet ? packet.toPacket() : JSON.stringify(packet);
        if (this.client.server.debug) this.logger.info(`[Client] ${toPacket}`, { server: this.client.server.name });

        const bufferPacket = this._toBufferPacket(toPacket, packet.type, packet.cmd);
        this.client.remote.write(bufferPacket);
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
    if (this.client.state === CONNECTION_STATE.CONNECTED) {
      try {
        const toPacket = packet instanceof Packet ? packet.toPacket() : JSON.stringify(packet);
        if (this.client.server.debug) this.logger.info(`[Remote] ${toPacket}`, { server: this.client.server.name });

        const bufferPacket = this._toBufferPacket(toPacket, packet.type, packet.cmd);
        this.client.socket.write(bufferPacket);
        await this.client.socket.write('\x00');
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
   */
  _toBufferPacket(packet, type = 255, cmd = 255) {
    packet = Buffer.from(packet);
    const array = Buffer.alloc(packet.length + 2);
    array[0] = type;
    array[1] = cmd;
    packet.copy(array, 2);
    return xor(array);
  }
}

module.exports = AdventureQuest3D;