import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
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

export async function getPublishedVideos() {
  if (!database) return fallbackVideos

  const videosQuery = query(ref(database, 'videos'), orderByChild('published'), equalTo(true))
  const snapshot = await get(videosQuery)
  return recordsFromSnapshot(snapshot)
}

export async function getAllVideos() {
  if (!database) return fallbackVideos
  const snapshot = await get(ref(database, 'videos'))
  return recordsFromSnapshot(snapshot)
}

export async function getVideoById(id) {
  if (!database) return fallbackVideos.find((video) => video.id === id) || null
  const snapshot = await get(ref(database, `videos/${id}`))
  return snapshot.exists() ? snapshot.val() : null
}

export async function createVideo(videoPayload) {
  if (!database || !auth?.currentUser) return { data: null, error: database ? { message: 'Please log in as an admin first.' } : getConfigurationError() }

  const videoRef = push(ref(database, 'videos'))
  const data = { ...videoPayload, id: videoRef.key }
  await set(videoRef, data)
  return { data, error: null }
}

export async function updateVideo(id, updates) {
  if (!database || !auth?.currentUser) return { data: null, error: database ? { message: 'Please log in as an admin first.' } : getConfigurationError() }

  const data = { ...updates, updated_at: new Date().toISOString() }
  await update(ref(database, `videos/${id}`), data)
  return { data: { id, ...data }, error: null }
}

export async function deleteVideo(id) {
  if (!database || !auth?.currentUser) return { error: database ? { message: 'Please log in as an admin first.' } : getConfigurationError() }
  await remove(ref(database, `videos/${id}`))
  return { error: null }
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
  return { data: { session: auth?.currentUser ? { user: auth.currentUser } : null }, error: null }
}
