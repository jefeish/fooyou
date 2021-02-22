const Command = require('./common/command.js')
const util = require('util')

class createComment extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  foo(context) {
    console.log('createComment3')
    const issueComment = context.issue({ body: 'Thanks for opening this issue!....XXXXX..' })
    return context.github.issues.createComment(issueComment)
  }
}

module.exports = createComment
