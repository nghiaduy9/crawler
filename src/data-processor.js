const axios = require('axios')
const { DataProcessor: SpidermanDataProcessor } = require('@albert-team/spiderman')
const { MetroHash64 } = require('metrohash')
const { getCollection } = require('./database')

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
    try {
      const History = await getCollection('history')
      const _id = this.getUrlId(this.url)
      const [prevData] = await History.find({ _id }).toArray()
      if (prevData === undefined) {
        History.insertOne({_id,...data})
      } else {
        const changes = {}
        for (const [css, value] of Object.entries(data)) {
          if (value !== prevData[css]) changes[css] = [prevData[css], value]
        }

        if (Object.keys(changes).length !== 0) {
          History.updateOne({ _id }, { $set: {_id,...data} })
          // notify the user of the changes
          const { status } = await axios.post(
            `${process.env.NOTIFICATION_SERVICE_ADDRESS}/notifications/changes`,
            { url: this.url, changes }
          )
          if (status < 200 || status >= 300)
            throw new Error('Failed to send request to the notification service')
        }
      }
      return { success: true }
    } catch (err) {
      console.error(err) // upgrade Spiderman to ^1.13.0 and use its logger
      return { success: false }
    }
  }
}
