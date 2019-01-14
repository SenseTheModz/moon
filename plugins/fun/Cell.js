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
            client.player.moveToCell(enter, spawn);
          },
        },
      ],
    });
  }
}

module.exports = Cell;
