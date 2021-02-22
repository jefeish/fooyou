const Command = require('./common/command.js')
// const getConfig = require('probot-config')
// const util = require('util')

class createComment extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
    // console.log('createComment')
  }

  execute(context) {
    app.log('createComment.execute()')
    const config = await getConfig(context, 'embedded-repos.yml')
    app.log('config:' + util.inspect(config))

    const issueComment = context.issue(
      {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.issue.number,
        body: 'Thanks for opening this issue!......'
      })

    return context.github.issues.createComment(issueComment)
  }
}

module.exports = createComment
