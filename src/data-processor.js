const axios = require('axios')
const { DataProcessor: SpidermanDataProcessor } = require('@albert-team/spiderman')

const { GATEWAY_ADDRESS } = process.env

const getUpdatedTargets = (targets, scrapedData) => {
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

const updateWatchTargets = async (watchID, updatedTargets) => {
  const { status } = await axios.put(
    `${GATEWAY_ADDRESS}/api/watch-manager/${watchID}/targets`,
    updatedTargets
  )
  if (status < 200 || status >= 300) throw new Error('Failed to update watch targets')
}

const notifyChanges = async (reqBody) => {
  const { status } = await axios.post(
    `${GATEWAY_ADDRESS}/api/notification-service/notifications/changes`,
    reqBody
  )
  if (status < 200 || status >= 300) throw new Error('Failed to notify changes')
}

module.exports = class DataProcessor extends SpidermanDataProcessor {
  constructor(watchData) {
    super()
    this.watchData = watchData
  }

  async process(data) {
    try {
      const { _id: watchID, userID, url, targets } = this.watchData
      const updatedTargets = getUpdatedTargets(targets, data)

      await Promise.all([
        updateWatchTargets(watchID, updatedTargets),
        updatedTargets.length && notifyChanges({ url, userID, updatedTargets })
      ])

      return { success: true }
    } catch (err) {
      this.logger.error(err)
      return { success: false }
    }
  }
}
