const VIDEO_STORAGE_KEY = 'mechmaster-videos'

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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function dedupeVideos(videos) {
  return videos.filter((video, index, list) => {
    const key = video.id || `${video.youtube_video_id || video.youtube_url || 'video'}-${index}`
    return list.findIndex((item) => (item.id || `${item.youtube_video_id || item.youtube_url || 'video'}-${index}`) === key) === index
  })
}

function readStoredVideos() {
  try {
    const raw = localStorage.getItem(VIDEO_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

async function readPublicVideos() {
  try {
    const response = await fetch('/videos.json', { cache: 'no-store' })
    if (!response.ok) return []
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    return []
  }
}

export async function getPublishedVideos() {
  const publicVideos = await readPublicVideos()
  const merged = dedupeVideos([...publicVideos, ...fallbackVideos])
  return merged.filter((video) => video.published !== false)
}

export async function getAllVideos() {
  const publicVideos = await readPublicVideos()
  const storedVideos = readStoredVideos()
  return dedupeVideos([...publicVideos, ...storedVideos, ...fallbackVideos])
}

export function createVideosJson(videos) {
  return JSON.stringify(videos, null, 2)
}

export async function getVideoById(id) {
  const videos = await getAllVideos()
  return videos.find((video) => video.id === id) || null
}

export async function createVideo(videoPayload) {
  const nextVideos = [videoPayload, ...readStoredVideos()]
  localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(dedupeVideos(nextVideos)))
  return { data: videoPayload, error: null }
}

export async function updateVideo(id, updates) {
  const currentVideos = readStoredVideos()
  const updated = currentVideos.map((video) => (video.id === id ? { ...video, ...updates, updated_at: new Date().toISOString() } : video))
  localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(updated))
  return { data: updated.find((video) => video.id === id) || null, error: null }
}

export async function deleteVideo(id) {
  const currentVideos = readStoredVideos()
  const nextVideos = currentVideos.filter((video) => video.id !== id)
  localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(nextVideos))
  return { error: null }
}

export async function isVideoDuplicate(youtubeVideoId) {
  const videos = await getAllVideos()
  return videos.some((video) => video.youtube_video_id === youtubeVideoId)
}

export async function signInAdmin(email, password) {
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@mechmaster.academy').trim().toLowerCase()
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'mechmaster123'

  if (email.trim().toLowerCase() === adminEmail && password === adminPassword) {
    return { data: { user: { email: adminEmail } }, error: null }
  }

  return { data: null, error: { message: 'Invalid admin email or password.' } }
}

export async function signOutAdmin() {
  return { error: null }
}

export async function getAdminSession() {
  return { data: { session: null }, error: null }
}
