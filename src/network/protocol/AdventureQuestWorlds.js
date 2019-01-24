const { ADVENTUREQUEST_WORLDS_PACKETS } = require('../../util/Constants');
const JsonPacket = require('./packets/aqw/JsonPacket');
const XmlPacket = require('./packets/aqw/XmlPacket');
const XtPacket = require('./packets/aqw/XtPacket');
const Protocol = require('./');

class AdventureQuestWorlds extends Protocol {
  constructor(client) {
    super(client);

    /**
     * Local handlers
     */
    this.regsiterLocalHandler(ADVENTUREQUEST_WORLDS_PACKETS.LOGIN, require('./handlers/aqw/local/Login'));

    /**
     * Remote handlers
     */
    this.regsiterRemoteHandler(ADVENTUREQUEST_WORLDS_PACKETS.LOGIN_RESPONSE,
      require('./handlers/aqw/remote/LoginResponse'));
    this.regsiterRemoteHandler(ADVENTUREQUEST_WORLDS_PACKETS.MOVE_TO_AREA, require('./handlers/aqw/remote/MoveToArea'));
    this.regsiterRemoteHandler(ADVENTUREQUEST_WORLDS_PACKETS.UOTLS, require('./handlers/aqw/remote/Uotls'));
    this.regsiterRemoteHandler(ADVENTUREQUEST_WORLDS_PACKETS.EXIT_AREA, require('./handlers/aqw/remote/ExitArea'));
  }

  /**
   * Constructs the local packet
   * @param {string} packet Packet to construct
   * @returns {Packet}
   * @public
   */
  constructPacket(packet) {
    const type = this._check(packet);

    switch (type) {
      case this.packetType.XML: return new XmlPacket(packet);
      case this.packetType.XT: return new XtPacket(packet);
      case this.packetType.JSON: return new JsonPacket(packet);
      default: return null;
    }
  }

  /**
   * Checks the packet type
   * @param {string} packet Packet to check
   * @returns {number}
   * @private
   */
  _check(packet) {
    const firstCharacter = packet[0];
    const lastCharacter = packet[packet.length - 1];

    if (firstCharacter === '<' && lastCharacter === '>') return this.packetType.XML;
    if (firstCharacter === '%' && lastCharacter === '%') return this.packetType.XT;
    if (firstCharacter === '{' && lastCharacter === '}') return this.packetType.JSON;
    return this.packetType.UNDEFINED;
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
}

module.exports = AdventureQuestWorlds;
