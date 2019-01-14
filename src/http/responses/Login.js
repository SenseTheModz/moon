const Process = require('../../process');
const cheerio = require('cheerio');
const builder = require('xmlbuilder');

/**
 * Handles the login response
 * @param {string} text Login response
 * @returns {string}
 */
const loginResponse = ({ text }) => {
  const $ = cheerio.load(text, { xmlMode: true });
  const success = $('login').attr('bSuccess');

  $('login').attr('bCCOnly', 0);
  $('login').attr('iUpg', 1);

  if (!success) throw new Error(text);
  for (const [name, server] of Process.serverList) $('login').prepend(create(name, server));
  return $.xml();
};

/**
 * Creates the server object
 * @param {string} name Server name
 * @param {Object} server Server object
 * @returns {string}
 */
const create = (name, { port, count }) => builder.create({
  servers: {
    sName: name,
    sIP: '127.0.0.1',
    iCount: count,
    iMax: 1000,
    bOnline: 1,
    iChat: 2,
    bUpg: 0,
    sLang: 'en',
    iPort: port,
  },
}).end();

module.exports = loginResponse;
