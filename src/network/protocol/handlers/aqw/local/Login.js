const Handler = require('../../');

class Login extends Handler {
  handle(packet) {
    const username = packet.object('nick').text().split('~')[1];
    const token = packet.object('pword').text();
    this.manager.client.constructPlayer({ username, token });
  }
}

module.exports = Login;

