const Handler = require('../..');

class uotls extends Handler {
  handle(packet) {
    const { b: { o: { cmd } } } = packet.object;

    if (cmd === 'uotls') this.client.player.room.addPlayer(packet.object.b.o.o.uoName, packet.object.b.o.o);
  }
}

module.exports = uotls;
