const CrawlerService = require('./service')

module.exports = async (server, opts) => {
  const { scheduler } = opts
  const crawlerService = new CrawlerService(scheduler)

  server.post('/', async (req, res) => {
    try {
      const { watchID } = req.body
      await crawlerService.scrapeWatch(watchID)
      res.status(204).send()
    } catch (err) {
      server.log.error(err.message)
      res.status(500).send()
    }
  })
}
