const chalk = require('chalk');
const { version } = require('../../package.json');

class Util {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Prints moon ascii art to the console
   * @static
   */
  static dumpAsciiLogo() {
    // eslint-disable-next-line no-console
    console.log(chalk.whiteBright([
      '       __   __       ',
      ' |\\/| /  \\ /  \\ |\\ | ',
      ' |  | \\__/ \\__/ | \\| ',
      '',
    ].join('\n')), `\n\t ${chalk.whiteBright(`Version v${version}`)}\n`);
  }
}

module.exports = Util;

