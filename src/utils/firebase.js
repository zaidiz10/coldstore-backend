const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json')); // Correct relative path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('Firebase initialized')

function sendNotificationToMobile(token, title, body) {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  admin.messaging().send(message)
    .then(response => {
      console.log('✅ Notification sent:', response);
    })
    .catch(error => {
      console.error('❌ Error sending notification:', error);
    });
}

module.exports = { sendNotificationToMobile };
