const Handler = require('../../');

class Login extends Handler {
  handle(packet) {
    this.manager.client.constructPlayer(packet.object);
  }
}

module.exports = Login;

