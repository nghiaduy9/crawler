const admin = require('firebase-admin')
const cred = require('../firebase-key.private.json')

const app = admin.initializeApp({
  credential: admin.credential.cert(cred),
  databaseURL: 'https://night-watch-c9ce6.firebaseio.com'
})
const db = app.firestore()

module.exports = {
  History: db.collection(process.env.FIREBASE_FIRESTORE_COLLECTION_PREFIX + 'history')
}
