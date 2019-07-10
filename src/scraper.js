const { Scraper: SpidermanScraper } = require('@albert-team/spiderman')
const { JSDOM } = require('jsdom')

module.exports = class Scraper extends SpidermanScraper {
  constructor(cssSelectors) {
    super()
    // mapping from CSS selectors to their type (string, number,...)
    this.cssSelectors = cssSelectors
  }

  parse(html) {
    const dom = new JSDOM(html)
    const { document } = dom.window
    const data = {}
    for (const css of Object.keys(this.cssSelectors)) {
      // for now, ignore types and treat everything as string
      data[css] = document.querySelector(css).textContent.trim()
    }
    return { data, nextUrls: [] }
  }
}
