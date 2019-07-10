require('dotenv-flow').config()

const fastify = require('fastify')
const apiRoutes = require('./api/routes')
const Scheduler = require('./scheduler')

const loggerLevel = process.env.NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })
const scheduler = new Scheduler()

server.register(apiRoutes, { prefix: '/api', scheduler })

server.get('/', async () => {
  return { iam: '/' }
})

const start = async () => {
  try {
    await Promise.all([
      server.listen(process.env.PORT || 3002, '::'), // listen to all IPv6 and IPv4 addresses
      scheduler.start()
    ])
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
