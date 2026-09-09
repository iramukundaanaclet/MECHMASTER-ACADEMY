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

export async function getPublishedVideos() {
  if (!supabase) return fallbackVideos

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Could not load shared videos:', error)
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
    console.error('Could not load admin videos:', error)
    return fallbackVideos
  }

  return data || []
}

export async function getVideoById(id) {
  if (!supabase) return fallbackVideos.find((video) => video.id === id) || null

  const { data, error } = await supabase.from('videos').select('*').eq('id', id).single()
  return error ? null : data
}

export async function createVideo(videoPayload) {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' } }
  }

  const { data, error } = await supabase.from('videos').insert([videoPayload]).select().single()
  return { data, error }
}

export async function updateVideo(id, updates) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }

  const { data, error } = await supabase.from('videos').update(updates).eq('id', id).select().single()
  return { data, error }
}

export async function deleteVideo(id) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }

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

  if (error) return false
  return Boolean(data?.length)
}

export async function signInAdmin(email, password) {
  if (!supabase) {
    return { data: null, error: { message: 'Configure Supabase before using the admin login.' } }
  }

  return supabase.auth.signInWithPassword({ email: email.trim(), password })
}

export async function signOutAdmin() {
  if (!supabase) return { error: null }
  return supabase.auth.signOut()
}

export async function getAdminSession() {
  if (!supabase) return { data: { session: null }, error: null }
  return supabase.auth.getSession()
}

export function createVideosJson(videos) {
  return JSON.stringify(videos, null, 2)
}
