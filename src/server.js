require('dotenv-flow').config()

const fastify = require('fastify')
const { UrlEntity } = require('@albert-team/spiderman/entities')
const Scheduler = require('./scheduler')
const Scraper = require('./scraper')
const DataProcessor = require('./data-processor')

const { NODE_ENV, PORT } = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })
const scheduler = new Scheduler()

server.get('/', async () => {
  return { iam: '/' }
})

server.post('/', async (req, res) => {
  const { url, cssSelectors } = req.body
  const urlEntity = new UrlEntity(url, new Scraper(cssSelectors), new DataProcessor(url))
  try {
    await scheduler.scheduleUrlEntity(urlEntity)
    res.code(200)
  } catch (err) {
    req.log.error(err.message)
    res.code(500)
  }
})

const start = async () => {
  try {
    await Promise.all([
      server.listen(PORT, '::'), // listen to all IPv6 and IPv4 addresses
      scheduler.start()
    ])
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
