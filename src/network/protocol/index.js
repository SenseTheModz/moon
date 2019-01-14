const XmlPacket = require('./packets/XmlPacket');
const XtPacket = require('./packets/XtPacket');
const JsonPacket = require('./packets/JsonPacket');

class Protocol {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Packet types
   * @returns {Object}
   * @static
   */
  static get packetType() {
    return {
      XML: 0,
      XT: 1,
      JSON: 2,
      UNDEFINED: 3,
    };
  }

  /**
   * Constructs the local packet
   * @param {string} packet Packet to construct
   * @returns {Packet}
   * @static
   */
  static constructPacket(packet) {
    const firstCharacter = packet[0];
    const lastCharacter = packet[packet.length - 1];

    const type = this._packetType(firstCharacter, lastCharacter);
    switch (type) {
      case this.packetType.XML: return new XmlPacket(packet);
      case this.packetType.XT: return new XtPacket(packet);
      case this.packetType.JSON: return new JsonPacket(packet);
      default: return null;
    }
  }

  /**
   * Checks the packet type
   * @param {string} firstCharacter First character of the packet
   * @param {string} lastCharacter Last character of the packet
   * @returns {number}
   */
  static _packetType(firstCharacter, lastCharacter) {
    if (firstCharacter === '<' && lastCharacter === '>') return this.packetType.XML;
    if (firstCharacter === '%' && lastCharacter === '%') return this.packetType.XT;
    if (firstCharacter === '{' && lastCharacter === '}') return this.packetType.JSON;
    return this.packetType.UNDEFINED;
  }
}

module.exports = Protocol;
