const Handler = require('../');
const Config = require('../../../config');

class LoginResponse extends Handler {
  handle(packet) {
    packet.send = false;

    const { messageOfTheDay } = Config.get('settings');
    packet.object[7] = messageOfTheDay;
    return this.manager.client.writeToLocal(packet);
  }
}

module.exports = LoginResponse;
