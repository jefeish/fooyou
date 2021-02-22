const Command = require('./common/command.js')
const e = require('json-rules-engine')
const flatten = require('flat')
const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')

/**
 * @description A basic Rules Engine wrapper class that loads Rules
 *              and applies them to facts from an event context JSON.
 */
class rulesEngineWrapper extends Command {
  constructor(rulesPath) {
    super()
    this.rulesPath = rulesPath
    this.engine = new e.Engine()
  }

  /**
   * @description Load and add all Rules to the Rules engine, that come from files that start with the 'prefix'.
   *              The 'Rules' get re-loaded on every event (might be a bit too much)
   * @param {*} prefix
   */
  loadRules(prefix) {
    try {
      let rulesFiles = ''
      let jsonRule
      const files = fs.readdirSync(this.rulesPath)
      files.forEach(rulesFile => {
        if (!prefix) { prefix = '' }
        if (rulesFile.startsWith(prefix)) {
          rulesFiles += ' ' + rulesFile
          // eslint-disable-next-line no-path-concat
          // console.log('dir :' + __dirname)
          const ruleData = fs.readFileSync(process.cwd() + '/src/' + this.rulesPath + '/' + rulesFile)
          if (path.extname(rulesFile) === 'json') {
            jsonRule = JSON.parse(ruleData)
          } else if (path.extname(rulesFile) === 'yml') {
            jsonRule = JSON.stringify(yaml.safeLoad(ruleData), null, 4)
          }
          this.engine.addRule(jsonRule)
        } else {
          console.log('Ignoring rules file, [' + rulesFile + ']')
        }
      })
      console.log('Loaded rules files, [' + rulesFiles + ' ]')
    } catch (err) {
      console.log('error reading rules from, [' + process.cwd() + '/src/' + this.rulesPath + ']')
    }
  }

  /**
   * @description Load the required rules files (prefix) and trigger the rules engine
   * @param {*} prefix
   */
  applyRules(prefix, context) {
    this.loadRules(prefix)
    // Run the engine to evaluate the facts and conditions
    this.engine
      .run(flatten(context))
      .then(results => {
        results.events.map(event => console.log(event.params.message))
      })
      .catch(function (err) {
        console.log('error: ', err)
      })
  }

  /**
   * @description Load specific Rules (use prefix) for processing App configuration facts
   *              (coming from .github/)
   * @param {*} configPrefix
   */
  appConfig(configPrefix, context) {
    this.applyRules(configPrefix, context)
  }

  /**
   * @description Execute the Rule process and load (or reload) the rules
   *              for every event invocation.
   *              This creates some 'loading' overhead but also allows us to
   *              update the rules without having to restart the App.
   * @param context
   */
  execute(context) {
    // Note: using 'context.event' as the prefix name is a bit of a trick.
    //       It now requires that we also prefix the name of the rules file
    //       with the same name as the GitHub event.
    //       This is done so that we don't add rules for an event that
    //       does not contain the right 'facts', the rules engine would error.
    this.applyRules(context.event, context)
  }
}

module.exports = rulesEngineWrapper
