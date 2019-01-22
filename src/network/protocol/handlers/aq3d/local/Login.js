const Handler = require('../../');

class Login extends Handler {
  handle(packet) {
    this.client.constructPlayer(packet.object);
  }
}

module.exports = Login;

