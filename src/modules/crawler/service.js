const { UrlEntity } = require('@albert-team/spiderman/entities')
const axios = require('axios').default
const Scraper = require('./scraper')
const DataProcessor = require('./data-processor')

const { GATEWAY_ADDRESS } = process.env

class CrawlerService {
  constructor(scheduler) {
    this.scheduler = scheduler
  }

  async scrapeWatch(watchID) {
    const { data: watchData } = await axios.get(
      `${GATEWAY_ADDRESS}/api/watch-manager/${watchID}`
    )
    const { url } = watchData
    const urlEntity = new UrlEntity(
      url,
      new Scraper(watchData),
      new DataProcessor(watchData)
    )
    await this.scheduler.scheduleUrlEntity(urlEntity)
  }
}

module.exports = CrawlerService
