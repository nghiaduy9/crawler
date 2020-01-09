const fastify = require('fastify')
const axios = require('axios')
const { UrlEntity } = require('@albert-team/spiderman/entities')
const Scheduler = require('./scheduler')
const Scraper = require('./scraper')
const DataProcessor = require('./data-processor')

const { NODE_ENV, PORT, GATEWAY_ADDRESS } = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })
const scheduler = new Scheduler()

server.get('/', async () => {
  return { iam: '/' }
})

server.post('/', async (req, res) => {
  try {
    const { watchID } = req.body
    const { data: watchData } = await axios.get(
      `${GATEWAY_ADDRESS}/api/wach-manager/${watchID}`
    )
    const { url } = watchData
    const urlEntity = new UrlEntity(
      url,
      new Scraper(watchData),
      new DataProcessor(watchData)
    )
    await scheduler.scheduleUrlEntity(urlEntity)
    res.code(204)
  } catch (err) {
    req.log.error(err.message)
    res.code(500).send()
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
