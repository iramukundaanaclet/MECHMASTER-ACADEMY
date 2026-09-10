import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'
import firebaseConfig from '../firebaseConfig'

let firebaseApp
let auth
let database

try {
  firebaseApp = initializeApp(firebaseConfig)
  auth = getAuth(firebaseApp)
  database = getDatabase(firebaseApp)
} catch (error) {
  console.error('Firebase initialization failed:', error)
}

const fallbackVideos = [
  {
    id: 'demo-1',
    youtube_video_id: 'aC3PdMbbRk4',
    youtube_url: 'https://www.youtube.com/watch?v=aC3PdMbbRk4',
    title: 'Understanding the Alternator',
    description:
      'Learn how the alternator charges the system and supports everyday vehicle operation.',
    category: 'Electrical',
    vehicle_type: 'Automotive',
    level: 'Beginner',
    duration: '10:25',
    thumbnail_url:
      'https://img.youtube.com/vi/aC3PdMbbRk4/hqdefault.jpg',
    published: true,
  },
  {
    id: 'demo-2',
    youtube_video_id: '2iZE0DkF0K0',
    youtube_url: 'https://www.youtube.com/watch?v=2iZE0DkF0K0',
    title: 'Brake System Basics',
    description:
      'A workshop-friendly overview of hydraulic braking and common service checks.',
    category: 'Brakes',
    vehicle_type: 'Automotive',
    level: 'Intermediate',
    duration: '12:40',
    thumbnail_url:
      'https://img.youtube.com/vi/2iZE0DkF0K0/hqdefault.jpg',
    published: true,
  },
]

function getConfigurationError() {
  return {
    message:
      'Firebase Authentication is not configured. Add VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID to your deployment environment.',
  }
}

function recordsFromSnapshot(snapshot) {
  if (!snapshot.exists()) {
    return []
  }

  return Object.values(snapshot.val())
}

async function getAuthenticatedUser() {
  if (!auth) {
    return null
  }

  if (auth.currentUser) {
    return auth.currentUser
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export async function getPublishedVideos() {
  if (!database) {
    return fallbackVideos
  }

  try {
    const videosQuery = query(
      ref(database, 'videos'),
      orderByChild('published'),
      equalTo(true)
    )

    const snapshot = await get(videosQuery)

    return recordsFromSnapshot(snapshot)
  } catch (error) {
    console.error(
      'Could not load public Firebase videos:',
      error
    )

    return fallbackVideos
  }
}

export async function getAllVideos() {
  if (!database) {
    return fallbackVideos
  }

  try {
    const snapshot = await get(ref(database, 'videos'))

    return recordsFromSnapshot(snapshot)
  } catch (error) {
    console.error(
      'Could not load Firebase admin videos:',
      error
    )

    return fallbackVideos
  }
}

export async function getVideoById(id) {
  if (!database) {
    return (
      fallbackVideos.find((video) => video.id === id) ||
      null
    )
  }

  try {
    const snapshot = await get(
      ref(database, `videos/${id}`)
    )

    return snapshot.exists() ? snapshot.val() : null
  } catch (error) {
    console.error(
      'Could not load Firebase video:',
      error
    )

    return null
  }
}

export async function createVideo(videoPayload) {
  if (!database) {
    return {
      data: null,
      error: getConfigurationError(),
    }
  }

  const authenticatedUser = await getAuthenticatedUser()

  if (!authenticatedUser) {
    return {
      data: null,
      error: {
        message: 'Please log in as an admin first.',
      },
    }
  }

  try {
    const videoRef = push(
      ref(database, 'videos')
    )

    const data = {
      ...videoPayload,
      id: videoRef.key,
    }

    await set(videoRef, data)

    return {
      data,
      error: null,
    }
  } catch (error) {
    console.error(
      'Could not create Firebase video:',
      error
    )

    return {
      data: null,
      error,
    }
  }
}

export async function updateVideo(id, updates) {
  if (!database) {
    return {
      data: null,
      error: getConfigurationError(),
    }
  }

  const authenticatedUser = await getAuthenticatedUser()

  if (!authenticatedUser) {
    return {
      data: null,
      error: {
        message: 'Please log in as an admin first.',
      },
    }
  }

  try {
    const data = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    await update(
      ref(database, `videos/${id}`),
      data
    )

    return {
      data: {
        id,
        ...data,
      },
      error: null,
    }
  } catch (error) {
    console.error(
      'Could not update Firebase video:',
      error
    )

    return {
      data: null,
      error,
    }
  }
}

export async function deleteVideo(id) {
  if (!database) {
    return {
      error: getConfigurationError(),
    }
  }

  const authenticatedUser = await getAuthenticatedUser()

  if (!authenticatedUser) {
    return {
      error: {
        message: 'Please log in as an admin first.',
      },
    }
  }

  try {
    await remove(
      ref(database, `videos/${id}`)
    )

    return {
      error: null,
    }
  } catch (error) {
    console.error(
      'Could not delete Firebase video:',
      error
    )

    return {
      error,
    }
  }
}

export async function isVideoDuplicate(youtubeVideoId) {
  if (!youtubeVideoId) {
    return false
  }

  const normalizedVideoId = youtubeVideoId.trim().toLowerCase()
  const videos = await getAllVideos()

  return videos.some(
    (video) =>
      typeof video.youtube_video_id === 'string' &&
      video.youtube_video_id.trim().toLowerCase() === normalizedVideoId
  )
}

/*
 * ADMIN LOGIN
 *
 * Important:
 * LoginPage expects:
 *
 * {
 *   data: {
 *     user: ...
 *   },
 *   error: null
 * }
 *
 * So we convert Firebase UserCredential
 * into that structure here.
 */
export async function signInAdmin(email, password) {
  if (!auth) {
    return {
      data: null,
      error: getConfigurationError(),
    }
  }

  try {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )

    return {
      data: {
        user: userCredential.user,
      },
      error: null,
    }
  } catch (error) {
    console.error(
      'Firebase admin login failed:',
      error
    )

    return {
      data: null,
      error,
    }
  }
}

export async function signOutAdmin() {
  if (!auth) {
    return {
      error: null,
    }
  }

  try {
    await signOut(auth)

    return {
      error: null,
    }
  } catch (error) {
    console.error(
      'Firebase logout failed:',
      error
    )

    return {
      error,
    }
  }
}

export async function getAdminSession() {
  if (!auth) {
    return {
      data: {
        session: null,
      },
      error: null,
    }
  }

  try {
    const user = await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          unsubscribe()
          resolve(currentUser)
        }
      )
    })

    return {
      data: {
        session: user
          ? {
              user,
            }
          : null,
      },
      error: null,
    }
  } catch (error) {
    console.error(
      'Could not get Firebase admin session:',
      error
    )

    return {
      data: {
        session: null,
      },
      error,
    }
  }
}