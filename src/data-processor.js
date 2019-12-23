const axios = require('axios')
const { DataProcessor: SpidermanDataProcessor } = require('@albert-team/spiderman')

const { GATEWAY_ADDRESS } = process.env

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
          `${GATEWAY_ADDRESS}/api/watch-manager/${watchID}/targets`,
          updatedTargets
        )
        // notify the user of the changes
        const { url, userID } = this.watchData
        const { status } = await axios.post(
          `${GATEWAY_ADDRESS}/api/notification-service/notifications/changes`,
          {
            url,
            userID,
            updatedTargets
          }
        )
        if (status < 200 || status >= 300)
          throw new Error('Failed to send request to the notification service')
      }
      return { success: true }
    } catch (err) {
      this.logger.error(err)
      return { success: false }
    }
  }
}
