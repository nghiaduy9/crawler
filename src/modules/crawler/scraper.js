const { Scraper: SpidermanScraper } = require('@albert-team/spiderman')
const { chromium } = require('playwright')
const userAgents = require('../../../user-agents.private.json')

class Scraper extends SpidermanScraper {
  constructor(watchData) {
    super(userAgents)
    this.watchData = watchData
  }

  parse() {
    throw new Error('This should never be executed!')
  }

  async process(url) {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(url)
    const data = {} // mapping from CSS selectors to their values
    const { targets } = this.watchData
    for (const target of targets) {
      // for now, ignore types and treat everything as string
      const { cssSelector } = target
      await page.waitForSelector(cssSelector)
      data[cssSelector] = await page.evaluate(() => {
        // eslint-disable-next-line
        return document.body.querySelector(cssSelector).textContent.trim()
      })
    }
    return { data, nextUrls: [] }
  }
}

module.exports = Scraper