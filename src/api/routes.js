const { UrlEntity } = require('@albert-team/spiderman/entities')
const Scraper = require('../scraper')
const DataProcessor = require('../data-processor')

module.exports = (server, opts, next) => {
  const { scheduler } = opts

  server.get('/', async () => {
    return { iam: '/api' }
  })

  // run a watch
  server.post('/', async (req) => {
    const { url, cssSelectors } = req.body
    const urlEntity = new UrlEntity(
      url,
      new Scraper(cssSelectors),
      new DataProcessor(url)
    )
    try {
      await scheduler.scheduleUrlEntity(urlEntity)
      return { success: true }
    } catch (err) {
      req.log.error(err.message)
      return { success: false }
    }
  })

  next()
}
