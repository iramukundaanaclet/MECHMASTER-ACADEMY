const fallbackConfig = {
  apiKey: 'AIzaSyAQoS1Xk94rzgB-MiiBbVXr76qj4PmXNaY',
  authDomain: 'mechamaster-accademy.firebaseapp.com',
  databaseURL: 'https://mechamaster-accademy-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'mechamaster-accademy',
  storageBucket: 'mechamaster-accademy.firebasestorage.app',
  messagingSenderId: '625317249929',
  appId: '1:625317249929:web:22155548d88419fa9e1758',
}

function getConfigValue(name) {
  const value = import.meta.env[name]
  return value && !value.startsWith('your-') && !value.startsWith('your_')
    ? value
    : fallbackConfig[name]
}

const firebaseConfig = Object.fromEntries(
  Object.keys(fallbackConfig).map((name) => [name, getConfigValue(name)])
)

export default firebaseConfig
