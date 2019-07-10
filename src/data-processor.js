const { DataProcessor: SpidermanDataProcessor } = require('@albert-team/spiderman')
const { MetroHash64 } = require('metrohash')
const { History } = require('./firestore')

module.exports = class DataProcessor extends SpidermanDataProcessor {
  constructor(url) {
    super()
    this.hasher = new MetroHash64()
    this.docRef = History.doc(this.getUrlId(url))
  }

  /**
   * Get base64 ID of the URL
   * @param {string} url URL
   * @return {string} ID
   */
  getUrlId(url) {
    this.hasher.update(url)
    return Buffer.from(this.hasher.digest())
      .toString('base64')
      .replace(/=+$/, '')
  }

  async process(data) {
    const doc = await this.docRef.get()
    const prevData = doc.exists ? doc.data() : {}

    for (const [css, value] of Object.entries(data)) {
      if (value !== prevData[css]) {
        // notify the user of the change(s)
      }
    }

    this.docRef.set(data, { merge: true })
    return { success: true }
  }
}
