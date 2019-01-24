const superagent = require('superagent');

class Http {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Reverse proxies AdventureQuest Worlds
   * @param {string} url Address path
   * @returns {Promise<request>}
   * @static
   */
  static proxy(url) {
    return superagent.get(url)
      .buffer(true);
  }

  /**
   * Makes a HTTP get request
   * @param {string} url Website address
   * @returns {Promise<request>}
   */
  static get(url) {
    return superagent.get(url);
  }

  /**
   * Makes a HTTP post request
   * @param {string} url Website address
   * @returns {Promise<request>}
   */
  static post(url) {
    return superagent.post(url);
  }
}

module.exports = Http;
