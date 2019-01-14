const Plugin = require('../../src/plugin');

class Copy extends Plugin {
  constructor(server) {
    super(server, {
      name: 'copy',
      author: 'spirtik',
      enabled: true,
      commands: [
        {
          name: 'copy',
          description: 'Copies a players message',
          execute: ({ client, parameters }) => client.state
            .set('copy', 'action', !client.state.get('chat', 'action'))
            .set('copy', 'player', parameters.join(' ').toLowerCase()),
        },
      ],
      hooks: [
        {
          packet: 'chatm',
          type: 'remote',
          execute: ({ client, packet }) => {
            const [type, message] = packet.object[4].split('~');
            const player = packet.object[5].toLowerCase();

            if (client.state.get('copy', 'action') && type === 'zone') {
              if (client.state.get('copy', 'player') === player) client.player.sendMessage(message);
            }
          },
        },
      ],
    });
  }
}

module.exports = Copy;
