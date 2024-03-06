const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

const serviceAccount = require('./creds.json');

const firebaseApp = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bjweb.firebaseio.com"
});

const db = getFirestore(firebaseApp);

module.exports = db;
