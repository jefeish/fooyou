/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
const init = require('./init.js')

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {

  // app.on('issues.opened', async context => {

  //   app.log('make a quick comment')
  //   const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
  //   return context.github.issues.createComment(issueComment)
  // })

  app.log('Yay, the app was loaded!')
  init.registerEventHandler(app)

}
