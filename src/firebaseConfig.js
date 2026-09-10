const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAQoS1Xk94rzgB-MiiBbVXr76qj4PmXNaY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mechamaster-accademy.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://mechamaster-accademy-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mechamaster-accademy',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mechamaster-accademy.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '625317249929',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:625317249929:web:22155548d88419fa9e1758',
}

export default firebaseConfig
