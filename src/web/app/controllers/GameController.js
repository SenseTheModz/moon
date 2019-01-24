const LoginResponse = require('../../../http/responses/Login');
const Http = require('../../../http');

class GameController {
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
   * Renders AdventureQuest Worlds
   * @param {Object} request Http request
   * @param {Object} response Http response
   * @returns {Promise<void>}
   * @public
   */
  index(request, response) {
    return Http.proxy(`${this.baseUrl}/${request.path}`).pipe(response);
  }

  /**
   * Renders play page
   * @param {Object} request Http request
   * @param {Object} response Http response
   * @returns {void}
   * @public
   */
  play(request, response) {
    return response.render('play');
  }

  /**
   * Attempts to authenticate an account
   * @param {Object} request Http request
   * @param {Object} response Http response
   * @public
   */
  async authenticate(request, response) {
    const credentials = {
      unm: request.body.unm,
      pwd: request.body.pwd,
    };

    try {
      const login = await Http.post(this.baseUrl)
        .type('form')
        .send(credentials);

      const loginResponse = LoginResponse(login);
      return response.status(200).send(loginResponse);
    } catch (error) {
      return response.status(200).send(error.message);
    }
  }
}

module.exports = new GameController();

