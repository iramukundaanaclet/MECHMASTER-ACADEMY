const YouTubePlayer = ({ videoId, title }) => {
  if (!videoId) {
    return <div className="rounded-2xl bg-[#F4F6F8] p-6 text-center text-slate-600">Video preview unavailable.</div>
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#0B1F33] shadow-md">
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || 'YouTube video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default YouTubePlayer
