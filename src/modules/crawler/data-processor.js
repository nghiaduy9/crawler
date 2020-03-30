const { DataProcessor: SpidermanDataProcessor } = require('@albert-team/spiderman')
const axios = require('axios')

const { GATEWAY_ADDRESS } = process.env

class DataProcessor extends SpidermanDataProcessor {
  constructor(watchData) {
    super()
    this.watchData = watchData
  }

  async process(data) {
    try {
      const { _id: watchID, userID, url, targets } = this.watchData
      const updatedTargets = this.getUpdatedTargets(targets, data)

      await Promise.all([
        this.updateWatchCheckedAt(watchID),
        updatedTargets.length && this.updateTargetData(updatedTargets),
        updatedTargets.length &&
          this.notifyTargetDataChanges(userID, url, updatedTargets),
      ])

      return { success: true }
    } catch (err) {
      this.logger.error(err)
      return { success: false }
    }
  }

  getUpdatedTargets(targets, scrapedData) {
    const result = []

    for (const target of targets) {
      const { cssSelector, data: oldData } = target
      const newData = scrapedData[cssSelector]

      if (oldData === newData) continue

      target.oldData = oldData
      target.data = newData
      result.push(target)
    }

    return result
  }

  async updateWatchCheckedAt(watchID) {
    await axios.put(`${GATEWAY_ADDRESS}/api/watch-manager/${watchID}/checkedAt`, {})
  }

  async updateTargetData(updatedTargets) {
    await Promise.all(
      updatedTargets.map(async (target) => {
        const { _id: targetID, data } = target
        await axios.put(`${GATEWAY_ADDRESS}/api/watch-manager/targets/${targetID}/data`, {
          data,
        })
      })
    )
  }

  async notifyTargetDataChanges(userID, url, updatedTargets) {
    await axios.post(
      `${GATEWAY_ADDRESS}/api/notification-service/notifications/changes`,
      { userID, url, updatedTargets }
    )
  }
}

module.exports = DataProcessor
