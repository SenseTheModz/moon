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

  /**
   * Sets character page background
   * @param {number} id Character background id
   * @returns {Promise<void>}
   */
  characterPageBackground(id = 1) {
    return this._client.writeToRemote(`%xt%zm%updateQuest%30%55%${parseInt(id)}%`);
  }

  /**
   * Moves to map cell
   * @param {string} frame Cell frame
   * @param {string} pad Cell pad
   * @returns {Promise<void>}
   */
  async moveToCell(frame = 'Enter', pad = 'Spawn') {
    await this._client.writeToRemote(`%xt%zm%moveToCell%-1%${frame}%${pad}%`);
    return this._client.writeToLocal(`%xt%gtc%-1%${frame}%${pad}%`);
  }

  /**
   * Quest complete
   * @param {string} title Quest title
   * @returns {Promise<void>}
   */
  questComplete(title = 'Quest', { icp = 0, intGold = 0, intExp = 0 }) {
    return this._client.writeToLocal({
      t: 'xt', b: {
        r: -1,
        o: {
          cmd: 'ccqr',
          rewardObj: {
            icp,
            intGold,
            intExp,
            typ: 'q',
          },
          bSuccess: 1,
          QuestID: -1,
          sName: title,
        },
      },
    });
  }

  /**
   * Sends a player message to the game
   * @param {sring} message Message to send
   * @returns {Promise<void>}
   */
  sendMessage(message) {
    return this._client.writeToRemote(`%xt%zm%message%1%${message}%zone%`);
  }

  /**
   * Creates a guild
   * @param {string} name Guild name
   * @returns {Promise<void>}
   */
  createGuild(name) {
    return this._client.writeToRemote(`%xt%zm%guild%1%gc%${name}%`);
  }
}

module.exports = Player;
