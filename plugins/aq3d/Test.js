const Plugin = require('../../src/plugin');

class Test extends Plugin {
  constructor(server) {
    super(server, {
      name: 'testing plugin',
      author: 'spirtiks',
      protocol: 'aq3d',
      commands: [
        {
          name: 'ping',
          description: 'Testing plugin for aq3d lol',
          execute: ({ client }) => client.writeToLocal({ sender: 'SERVER', msg: 'Ayy lmao', type: 4, cmd: 1 }),
        },
      ],
    });
  }
}

module.exports = Test;
