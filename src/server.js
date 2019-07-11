require('dotenv-flow').config()

const fastify = require('fastify')
const { UrlEntity } = require('@albert-team/spiderman/entities')
const Scheduler = require('./scheduler')
const Scraper = require('./scraper')
const DataProcessor = require('./data-processor')

const loggerLevel = process.env.NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })
const scheduler = new Scheduler()

server.get('/', async () => {
  return { iam: '/' }
})

server.post('/', async (req) => {
  const { url, cssSelectors } = req.body
  const urlEntity = new UrlEntity(url, new Scraper(cssSelectors), new DataProcessor(url))
  try {
    await scheduler.scheduleUrlEntity(urlEntity)
    return { success: true }
  } catch (err) {
    req.log.error(err.message)
    return { success: false }
  }
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
