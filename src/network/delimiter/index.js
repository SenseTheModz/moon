const { EventEmitter } = require('events');

class Delimiter extends EventEmitter {
  constructor() {
    super();

    /**
     * Packet buffer
     * @type {?string}
     * @private
     */
    this._buffer = '';
  }

  /**
   * Adds chuck of the packet data to the buffer
   * @param {string} data packet data
   * @private
   */
  chuck(data) {
    this._buffer += data;
    this._next();
  }

  /**
   * Handles the queue
   * @private
   */
  _next() {
    if (this._buffer[this._buffer.length - 1] === NULLDELIMITER) {
      const packets = this._buffer.split(NULLDELIMITER);

      for (let i = 0; i < packets.length - 1; i++) this.emit('packet', packets[i]);
      this._buffer = '';
    }
  }
}

const NULLDELIMITER = '\x00';

module.exports = Delimiter;
