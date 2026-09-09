export function getYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null

  try {
    const value = url.trim()
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([A-Za-z0-9_-]{11})/,
    ]

    for (const pattern of patterns) {
      const match = value.match(pattern)
      if (match && match[1]) return match[1]
    }

    return null
  } catch (error) {
    return null
  }
}

export function getYouTubeEmbedUrl(videoId) {
  if (!videoId) return ''
  return `https://www.youtube.com/embed/${videoId}`
}

export function getYouTubeThumbnail(videoId) {
  if (!videoId) return ''
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export function isValidYouTubeUrl(url) {
  return Boolean(url && typeof url === 'string' && getYouTubeVideoId(url))
}
