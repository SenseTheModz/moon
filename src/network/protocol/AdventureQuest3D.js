const { ADVENTUREQUEST_3D_PACKETS } = require('../../util/Constants');
const xor = require('../encryption/Xor');
const JsonPacket = require('./packets/aq3d/JsonPacket');
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
}

module.exports = AdventureQuest3D;
