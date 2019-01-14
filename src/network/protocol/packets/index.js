class Packet {
  constructor(packet) {
    this.object = packet;

    /**
     * Packet type
     * @type {string}
     * @public
     */
    this.type = null;

    /**
     * Packet send
     * @type {boolean}
     * @public
     */
    this.send = true;
  }

  parse() {
    throw new Error('Method not implemented.');
  }

  toPacket() {
    throw new Error('Method not implemented.');
  }
}

module.exports = Packet;
