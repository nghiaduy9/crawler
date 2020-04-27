const { Scheduler: SpidermanScheduler } = require('@albert-team/spiderman')
const fp = require('fastify-plugin')

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

const scheduler = new Scheduler()

module.exports = fp(async (server) => {
  await scheduler.start()
  server.decorate('scheduler', scheduler)
})
