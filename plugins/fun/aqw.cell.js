const Plugin = require('../../src/plugin');

class Cell extends Plugin {
  constructor(server) {
    super(server, {
      name: 'cell',
      author: 'spirtik',
      enabled: true,
      commands: [
        {
          name: 'cell',
          description: 'Makes you move to cell',
          execute: ({ client, parameters }) => {
            const [enter, spawn] = parameters;
            return this.moveToCell(client, enter, spawn);
          },
        },
      ],
    });
  }

  /**
   * Moves to map cell
   * @param {Client} client Client instance
   * @param {string} frame Cell frame
   * @param {string} pad Cell pad
   * @returns {Promise<void>}
   * @public
   */
  async moveToCell(client, frame = 'Enter', pad = 'Spawn') {
    await this._client.writeToRemote(`%xt%zm%moveToCell%-1%${frame}%${pad}%`);
    return this._client.writeToLocal(`%xt%gtc%-1%${frame}%${pad}%`);
  }
}

module.exports = Cell;
