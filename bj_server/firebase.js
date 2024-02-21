const {initializeApp, cert} = require('firebase/app');
const {getFirestore} = require('firebase/firestore');

const serviceAccount = require('./creds.json');

const firebaseApp = initializeApp({
    credential: cert(serviceAccount)
    });

const db = getFirestore(firebaseApp);

module.exports = db;