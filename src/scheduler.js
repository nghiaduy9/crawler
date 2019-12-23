const { Scheduler: SpidermanScheduler } = require('@albert-team/spiderman')

module.exports = class Scheduler extends SpidermanScheduler {
  constructor() {
    super(null)
  }

  /**
   * Do nothing. We manually enqueue URLs instead
   */
  classifyUrl() {
    throw new Error('This should never be executed!')
  }
}
