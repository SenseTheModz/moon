const Plugin = require('../../src/plugin');
const leet = require('leet');

class Leet extends Plugin {
  constructor(server) {
    super(server, {
      name: 'leet',
      author: 'spirtik',
      enabled: true,
      commands: [
        {
          name: 'leet',
          description: 'Talk in leet text',
          execute: ({ client }) => client.state.set('leet', 'action', !client.state.get('leet', 'action')),
        },
      ],
      hooks: [
        {
          packet: 'message',
          type: 'local',
          execute: ({ client, packet }) => {
            if (client.state.get('leet', 'action')) {
              packet.send = false;

              const message = packet.object[5];
              client.player.sendMessage(this._strip(leet.convert(
                message
              )));
            }
          },
        },
      ],
    });
  }

  _strip(text) {
    return text.replace(/zorz|xor/gi, '');
  }
}

module.exports = Leet;
