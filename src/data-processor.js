const axios = require('axios')

const { DataProcessor: SpidermanDataProcessor } = require('@albert-team/spiderman')
const { MetroHash64 } = require('metrohash')
const { History } = require('./firestore')

module.exports = class DataProcessor extends SpidermanDataProcessor {
  constructor(url) {
    super()
    this.hasher = new MetroHash64()
    this.url = url
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
    const docRef = History.doc(this.getUrlId(this.url))
    const doc = await docRef.get()
    const prevData = doc.exists ? doc.data() : {}
    const changes = {}
    for (const [css, value] of Object.entries(data)) {
      if (value !== prevData[css]) {
        changes[css] = [prevData[css], value]
      }
    }
    // notify the user of the change(s)
    try {
      await axios.post(`${process.env.NOTIFICATION_SERVICE_ADDRESS}/notifications/changes`, {
        url: `${this.url}`,
        changes: `${changes}`
      })
    } catch (err) {
      console.error(err)
      return { success: false }
    }

    docRef.set(data, { merge: true })
    return { success: true }
  }
}
