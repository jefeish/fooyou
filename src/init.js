/**
 * This code prepares the 'eventHandler' 
 * 
 * 
 */

const fs = require('fs')
const yaml = require('js-yaml')
const rulesEngineWrapper = require('./eventHandlers/rulesEngineWrapper.js')

/**
 * Implement a simple 'command pattern'
 * | @param app
 */
exports.registerEventHandler = function (app) {
  app.log('registerEventHandler')
  // process.chdir('src')
  // console.log('__dirname :' + __dirname + ' ./ :' + process.cwd())
  try {
    // Load config from .github/eventHandlers.yml in the repository
    // const config = app.config('eventHandlers.yml')
    // app.log('config:' + config)

    const fileContents = fs.readFileSync('./src/eventHandlers/eventHandlers.yml', 'utf8')
    const events = yaml.safeLoad(fileContents)
    let handlers = ''

    Object.keys(events).forEach(event => {
      events[event].forEach(handler => {
        // create a dynamic class
        const Cmd = require('./eventHandlers/' + handler + '.js')
        const action = new Cmd()
        handlers += ' ' + handler
        // register the WebHook event and map it to an 'eventHandler' class
        app.on(event, async context => action.execute(context))
      })

      if (handlers) {
        app.log('Event: [' + event + '] is associate with Handler(s): [' + handlers + ' ]')
        handlers = ''
      }
    })
  } catch (handler) {
    app.log(handler)
  }

  // relative to 'src'
  // // eslint-disable-next-line new-cap,no-undef
  // engine = new rulesEngineWrapper('eventHandlers/rules/')
  // // eslint-disable-next-line no-undef
  // engine.loadRules()
}
