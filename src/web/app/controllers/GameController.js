const Http = require('../../../http');

class GameController {
  /**
   * Renders AdventureQuest Worlds
   * @param {Object} request Http request
   * @param {Object} response Http response
   * @returns {Promise<void>}
   * @public
   */
  index(request, response) {
    return Http.proxy(request.path).pipe(response);
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
      const login = await Http.login(credentials);
      return response.status(200).send(login);
    } catch (error) {
      return response.status(200).send(error.message);
    }
  }
}

module.exports = new GameController();

