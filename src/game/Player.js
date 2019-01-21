class Player {
  constructor(client, { username, token }) {
    /**
     * Client that instantiated this player
     * @type {Client}
     * @public
     */
    this._client = client;

    /**
     * Username that instantiated this player
     * @type {string}
     * @public
     */
    this.username = username;

    /**
     * Token that instantiated this player
     * @type {string}
     * @public
     */
    this.token = token;
  }
}

module.exports = Player;
