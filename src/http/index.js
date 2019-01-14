const superagent = require('superagent');
const LoginResponse = require('./responses/Login');

class Http {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Host endpoint
   * @type {string}
   * @readonly
   * @static
   */
  static get baseUrl() {
    return 'https://game.aq.com';
  }

  /**
   * Reverse proxies AdventureQuest Worlds
   * @param {string} path Address path
   * @returns {Promise<request>}
   * @static
   */
  static proxy(path) {
    return superagent.get(`${this.baseUrl}/${path}`)
      .buffer(true);
  }

  /**
   * Attempts to authenticate the account
   * @param {Object} credentials Account login credentials
   * @returns {Promise<request>}
   */
  static login(credentials) {
    return superagent.post(`${this.baseUrl}/game/cf-userlogin.asp`)
      .type('form')
      .send(credentials)
      .then(LoginResponse);
  }
}

module.exports = Http;
