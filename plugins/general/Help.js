const Plugin = require('../../src/plugin');
const Config = require('../../src/config');

class Help extends Plugin {
  constructor(server) {
    super(server, {
      name: 'help',
      author: 'spirtik',
      enabled: true,
      commands: [
        {
          name: 'help',
          description: 'Displays the list of commands and their description',
          execute: async ({ client }) => {
            const promises = [];

            await client.serverMessage('server', '=== Command List ===');

            const { prefix } = Config.get('settings');
            for (const [command, value] of this.server.plugins.commands) {
              promises.push(client.serverMessage('server', `${prefix}${command} - ${value.description}`));
            }
            return Promise.all(promises);
          },
        },
      ],
    });
  }
}

module.exports = Help;
