import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

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

export async function signInAdmin(email, password) {
  if (!supabase) {
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@mechmaster.local').toLowerCase()
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'MechMaster123!'

    if (email.trim().toLowerCase() === adminEmail && password === adminPassword) {
      return { data: { user: { email: adminEmail } }, error: null }
    }

    return { data: null, error: { message: 'Invalid admin email or password.' } }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOutAdmin() {
  if (!supabase) return { error: null }
  return supabase.auth.signOut()
}

export async function getAdminSession() {
  if (!supabase) return { data: { session: null }, error: null }
  return supabase.auth.getSession()
}

export async function getPublishedVideos() {
  if (!supabase) return fallbackVideos

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching videos:', error)
    return fallbackVideos
  }

  return data || []
}

export async function getAllVideos() {
  if (!supabase) return fallbackVideos

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin videos:', error)
    return fallbackVideos
  }

  return data || []
}

export async function getVideoById(id) {
  if (!supabase) {
    return fallbackVideos.find((video) => video.id === id) || null
  }

  const { data, error } = await supabase.from('videos').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching video by ID:', error)
    return null
  }

  return data
}

export async function createVideo(videoPayload) {
  if (!supabase) {
    return { data: { ...videoPayload, id: crypto.randomUUID() }, error: null }
  }

  const { data, error } = await supabase.from('videos').insert([videoPayload]).select().single()
  return { data, error }
}

export async function updateVideo(id, updates) {
  if (!supabase) {
    return { data: { id, ...updates }, error: null }
  }

  const { data, error } = await supabase.from('videos').update(updates).eq('id', id).select().single()
  return { data, error }
}

export async function deleteVideo(id) {
  if (!supabase) {
    return { error: null }
  }

  const { error } = await supabase.from('videos').delete().eq('id', id)
  return { error }
}

export async function isVideoDuplicate(youtubeVideoId) {
  if (!supabase) return false

  const { data, error } = await supabase
    .from('videos')
    .select('id')
    .eq('youtube_video_id', youtubeVideoId)
    .limit(1)

  if (error) {
    console.error('Duplicate check failed:', error)
    return false
  }

  return Boolean(data && data.length)
}
