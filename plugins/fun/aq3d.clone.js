class Clone extends Plugin {
  constructor(server) {
    super(server, {
      name: 'clone',
      author: 'spirtiks',
      protocol: 'aq3d',
      commands: [
        {
          name: 'clone',
          description: 'Clones a player character model (client-side)',
          execute: ({ client, parameters }) => {
            const username = parameters.join(' ');
            return this.clone(client, username);
          },
        },
      ],
    });
  }

  /**
   * Clones a players character model
   * @param {Client} client Client instance
   * @param {sting} username Username of the player to clone
   * @returns {Promise<void>}
   * @public
   */
  clone(client, username) {
    if (!username) return null;

    const player = this.findPlayerByUsername(client, username);
    if (player) {
      return client.localWrite({
        EntityID: client.player.id,
        asset: player.baseAsset,
        type: 17,
        cmd: 16,
      });
    }
    return null;
  }

  /**
   * Find Player by username
   * @param {Client} client Client instance
   * @param {string} username Username of the player
   * @returns {any}
   * @public
   */
  findPlayerByUsername(client, username) {
    for (const player of client.player.room.players.values()) {
      if (player.name.toLowerCase() === username.toLowerCase()) return player;
    }
    return null;
  }
}

module.exports = Clone;
