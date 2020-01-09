const { Scraper: SpidermanScraper } = require('@albert-team/spiderman')
const { JSDOM } = require('jsdom')
const userAgents = require('../user-agents.private.json')

module.exports = class Scraper extends SpidermanScraper {
  constructor(watchData) {
    super(userAgents)
    this.watchData = watchData
  }

  parse(html) {
    const dom = new JSDOM(html)
    const { document } = dom.window
    const data = {}
    const { targets } = this.watchData
    for (const target of targets) {
      // for now, ignore types and treat everything as string
      const { cssSelector } = target
      data[cssSelector] = document.querySelector(cssSelector).textContent.trim()
    }
    return { data, nextUrls: [] }
  }
}
