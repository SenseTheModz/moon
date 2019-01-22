const Room = require('./Room');

class Player {
  constructor(client, { id, username, token }) {
    /**
     * Client that instantiated this player
     * @type {Client}
     * @public
     */
    this._client = client;

    /**
     * Id that instantiated this player
     * @type {number}
     * @public
     */
    this.id = id;

    /**
     * Username that instantiated this player
     * @type {string}
     * @public
     */
    this.username = username || null;

    /**
     * Token that instantiated this player
     * @type {string}
     * @public
     */
    this.token = token;

    /**
     * Player room
     * @type {Room}
     * @public
     */
    this.room = new Room();
  }
}

module.exports = Player;
