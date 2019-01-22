class Room {
  constructor(player) {
    /**
     * Player that instantiated this room
     * @type {Player}
     * @public
     */
    this.player = player;

    /**
     * Stores all of the players within the room
     * @type {Map<string, Object>}
     * @public
     */
    this.players = new Map();
  }

  /**
   * Adds a player to the room
   * @param {any} key Player key
   * @param {Object} data Player data
   * @public
   */
  addPlayer(key, data) {
    if (!this.players.has(key)) this.players.set(key, data);
  }

  /**
   * Removes a player from the room
   * @param {any} key Player key
   * @public
   */
  removePlayer(key) {
    if (this.players.has(key)) this.players.delete(key);
  }

  /**
   * Returns the player object if found
   * @param {any} key Player key to check for
   * @returns {any|Object}
   */
  getPlayerByKey(key) {
    return this.players.get(key) || {};
  }

  /**
   * Clears all players from the room
   * @public
   */
  clear() {
    this.players.clear();
  }
}

module.exports = Room;
