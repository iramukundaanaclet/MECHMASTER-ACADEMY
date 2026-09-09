import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { equalTo, get, getDatabase, orderByChild, push, query, ref, remove, set, update } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const firebaseConfigured = Object.values(firebaseConfig).every(Boolean)
const firebaseApp = firebaseConfigured ? initializeApp(firebaseConfig) : null
const auth = firebaseApp ? getAuth(firebaseApp) : null
const database = firebaseApp ? getDatabase(firebaseApp) : null
const localVideosStorageKey = 'mechmaster-local-videos'

const fallbackVideos = [
  {
    id: 'demo-1',
    youtube_video_id: 'aC3PdMbbRk4',
    youtube_url: 'https://www.youtube.com/watch?v=aC3PdMbbRk4',
    title: 'Understanding the Alternator',
    description: 'Learn how the alternator charges the system and supports everyday vehicle operation.',
    category: 'Electrical',
    vehicle_type: 'Automotive',
    level: 'Beginner',
    duration: '10:25',
    thumbnail_url: 'https://img.youtube.com/vi/aC3PdMbbRk4/hqdefault.jpg',
    published: true,
  },
  {
    id: 'demo-2',
    youtube_video_id: '2iZE0DkF0K0',
    youtube_url: 'https://www.youtube.com/watch?v=2iZE0DkF0K0',
    title: 'Brake System Basics',
    description: 'A workshop-friendly overview of hydraulic braking and common service checks.',
    category: 'Brakes',
    vehicle_type: 'Automotive',
    level: 'Intermediate',
    duration: '12:40',
    thumbnail_url: 'https://img.youtube.com/vi/2iZE0DkF0K0/hqdefault.jpg',
    published: true,
  },
]

function getConfigurationError() {
  return { message: 'Firebase is not configured. Add the VITE_FIREBASE_* values to your deployment environment.' }
}

function recordsFromSnapshot(snapshot) {
  if (!snapshot.exists()) return []
  return Object.values(snapshot.val())
}

function getLocalVideos() {
  try {
    const storedVideos = localStorage.getItem(localVideosStorageKey)
    return storedVideos ? JSON.parse(storedVideos) : []
  } catch (error) {
    return []
  }
}

function saveLocalVideos(videos) {
  localStorage.setItem(localVideosStorageKey, JSON.stringify(videos))
}

async function getAuthenticatedUser() {
  if (!auth) return null
  if (auth.currentUser) return auth.currentUser

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export async function getPublishedVideos() {
  if (!database) return [...fallbackVideos, ...getLocalVideos().filter((video) => video.published)]

  try {
    const videosQuery = query(ref(database, 'videos'), orderByChild('published'), equalTo(true))
    const snapshot = await get(videosQuery)
    return recordsFromSnapshot(snapshot)
  } catch (error) {
    console.error('Could not load public Firebase videos:', error)
    return fallbackVideos
  }
}

export async function getAllVideos() {
  if (!database) return [...fallbackVideos, ...getLocalVideos()]
  try {
    const snapshot = await get(ref(database, 'videos'))
    return recordsFromSnapshot(snapshot)
  } catch (error) {
    console.error('Could not load Firebase admin videos:', error)
    return fallbackVideos
  }
}

export async function getVideoById(id) {
  if (!database) return [...fallbackVideos, ...getLocalVideos()].find((video) => video.id === id) || null
  try {
    const snapshot = await get(ref(database, `videos/${id}`))
    return snapshot.exists() ? snapshot.val() : null
  } catch (error) {
    return null
  }
}

export async function createVideo(videoPayload) {
  if (!database) {
    const data = { ...videoPayload, id: `local-${Date.now()}` }
    saveLocalVideos([data, ...getLocalVideos()])
    return { data, error: null }
  }
  if (!await getAuthenticatedUser()) return { data: null, error: { message: 'Please log in as an admin first.' } }

  try {
    const videoRef = push(ref(database, 'videos'))
    const data = { ...videoPayload, id: videoRef.key }
    await set(videoRef, data)
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateVideo(id, updates) {
  if (!database) return { data: null, error: getConfigurationError() }
  if (!await getAuthenticatedUser()) return { data: null, error: { message: 'Please log in as an admin first.' } }

  try {
    const data = { ...updates, updated_at: new Date().toISOString() }
    await update(ref(database, `videos/${id}`), data)
    return { data: { id, ...data }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function deleteVideo(id) {
  if (!database) {
    saveLocalVideos(getLocalVideos().filter((video) => video.id !== id))
    return { error: null }
  }
  if (!await getAuthenticatedUser()) return { error: { message: 'Please log in as an admin first.' } }
  try {
    await remove(ref(database, `videos/${id}`))
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function isVideoDuplicate(youtubeVideoId) {
  const videos = await getAllVideos()
  return videos.some((video) => video.youtube_video_id === youtubeVideoId)
}

export async function signInAdmin(email, password) {
  if (!auth) return { data: null, error: getConfigurationError() }
  return signInWithEmailAndPassword(auth, email.trim(), password)
}

export async function signOutAdmin() {
  if (!auth) return { error: null }
  return signOut(auth)
}

export async function getAdminSession() {
  if (!auth) return { data: { session: null }, error: null }

  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      unsubscribe()
      resolve(currentUser)
    })
  })

  return { data: { session: user ? { user } : null }, error: null }
}
