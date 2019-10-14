const axios = require('axios')
const { DataProcessor: SpidermanDataProcessor } = require('@albert-team/spiderman')

module.exports = class DataProcessor extends SpidermanDataProcessor {
  constructor(watchData) {
    super()
    this.watchData = watchData
  }

  async process(data) {
    try {
      const { _id: watchID, targets } = this.watchData
      const updatedTargets = []
      for (const target of targets) {
        const { cssSelector } = target
        if (target.data !== data[cssSelector]) {
          target.oldData = target.data
          target.data = data[cssSelector]
          updatedTargets.push(target)
        }
      }
      if (updatedTargets.length !== 0) {
        // Update targets information of a watch
        axios.put(
          `${process.env.WATCH_MANAGER_ADDRESS}/${watchID}/targets`,
          updatedTargets
        )
        // notify the user of the changes
        const { url } = this.watchData
        const { status } = await axios.post(
          `${process.env.NOTIFICATION_SERVICE_ADDRESS}/notifications/changes`,
          { url, updatedTargets }
        )
        if (status < 200 || status >= 300)
          throw new Error('Failed to send request to the notification service')
      }
      return { success: true }
    } catch (err) {
      console.error(err) // upgrade Spiderman to ^1.13.0 and use its logger
      return { success: false }
    }
  }
}
