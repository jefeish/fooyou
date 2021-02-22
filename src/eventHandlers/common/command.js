/**
 * Trying to implement the 'command pattern' in NodeJS
 * A poor man's interface
 */
class Command {
  // eslint-disable-next-line no-useless-constructor
  constructor () {
  }

  execute () {
    throw new Error('Method not implemented')
  }
}

module.exports = Command
