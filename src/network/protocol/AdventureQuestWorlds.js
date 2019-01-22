const { CONNECTION_STATE } = require('../../util/Constants');
const JsonPacket = require('./packets/aqw/JsonPacket');
const XmlPacket = require('./packets/aqw/XmlPacket');
const XtPacket = require('./packets/aqw/XtPacket');
const Packet = require('./packets');
const Protocol = require('./');

class AdventureQuest3D extends Protocol {
  constructor(client) {
    super(client);

    /**
     * Local handlers
     */
    this.regsiterLocalHandler('login', require('./handlers/aqw/local/Login'));

    /**
     * Remote handlers
     */
    this.regsiterRemoteHandler('moveToArea', require('./handlers/aqw/remote/MoveToArea'));
    this.regsiterRemoteHandler('uotls', require('./handlers/aqw/remote/Uotls'));
    this.regsiterRemoteHandler('exitArea', require('./handlers/aqw/remote/ExitArea'));
  }

  /**
   * Constructs the local packet
   * @param {string} packet Packet to construct
   * @returns {Packet}
   * @public
   */
  constructPacket(packet) {
    const type = this.check(packet);

    switch (type) {
      case this.packetType.XML: return new XmlPacket(packet);
      case this.packetType.XT: return new XtPacket(packet);
      case this.packetType.JSON: return new JsonPacket(packet);
      default: return null;
    }
  }

  /**
   * Called on incoming/outgoing packet
   * @param {number} type Packet type
   * @param {string} packet Packet to handle
   * @public
   */
  onPacket(type, packet) {
    this.parseAndFire(type, packet);
  }

  /**
   * Sends the packet to the server
   * @param {Packet} packet Packet to send
   * @returns {Promise<void>}
   * @public
   */
  async writeToRemote(packet) {
    if (this.client.state === CONNECTION_STATE.CONNECTED) {
      try {
        let toPacket = packet instanceof Packet ? packet.toPacket() : packet;
        if (typeof toPacket === 'object') toPacket = JSON.stringify(toPacket);

        if (this.client.server.debug) this.logger.info(`[Client] ${toPacket}`, { server: this.client.server.name });
        await this.client.remote.write(`${toPacket}\x00`);
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
        let toPacket = packet instanceof Packet ? packet.toPacket() : packet;
        if (typeof toPacket === 'object') toPacket = JSON.stringify(toPacket);

        if (this.client.server.debug) this.logger.info(`[Remote] ${toPacket}`, { server: this.client.server.name });
        await this.client.socket.write(`${toPacket}\x00`);
      } catch (error) {
        this.logger.error(`Local send failed! Reason: ${error.message}`, { server: this.client.server.name });
      }
    }
  }
}

module.exports = AdventureQuest3D;
