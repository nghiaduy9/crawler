const axios = require('axios')
const { UrlEntity } = require('@albert-team/spiderman/entities')
const Scheduler = require('../scheduler')
const Scraper = require('../scraper')
const DataProcessor = require('../data-processor')

const { GATEWAY_ADDRESS } = process.env

const scheduler = new Scheduler()

module.exports = async (server) => {
  server.get('/', async () => {
    return { iam: '/' }
  })

  server.post('/', async (req, res) => {
    try {
      const { watchID } = req.body
      const { data: watchData } = await axios.get(
        `${GATEWAY_ADDRESS}/api/watch-manager/${watchID}`
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
}
