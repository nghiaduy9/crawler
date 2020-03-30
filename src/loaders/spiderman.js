const fp = require('fastify-plugin')
const { Scheduler: SpidermanScheduler } = require('@albert-team/spiderman')

class Scheduler extends SpidermanScheduler {
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

module.exports = fp((server) => {
  const scheduler = new Scheduler()
  server.decorate('scheduler', scheduler)
})
