import { getYouTubeId, getYouTubeThumbnail } from '../../utils/youtube'

const VideoCard = ({ video, onSelect, selected = false }) => {
  const youtubeId = getYouTubeId(video.youtube_video_id || video.youtube_url || '')
  const thumbnail = video.thumbnail_url || video.thumbnail || getYouTubeThumbnail(youtubeId) || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80'

  return (
    <article className={`overflow-hidden rounded-2xl border shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${selected ? 'border-[#FF7800] bg-[#FFF3E8]' : 'border-slate-200 bg-white'}`}>
      <img src={thumbnail} alt={video.title} className="h-44 w-full object-cover" />
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-[#FF7800]">
          <span>{video.category || video.vehicle_type || 'General'}</span>
          <span>{video.level || 'Beginner'}</span>
        </div>
        <h3 className="text-lg font-bold text-[#0B1F33]">{video.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{video.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{video.duration || 'Video lesson'}</span>
          <span>{video.provider || 'MechMaster Academy'}</span>
        </div>
        <button type="button" onClick={onSelect} className="mt-5 inline-flex rounded-full bg-[#0B1F33] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#142f4d]">
          {selected ? 'Selected' : 'Watch Video'}
        </button>
      </div>
    </article>
  )
}

export default VideoCard
