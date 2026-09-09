const VideoCard = ({ video }) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <img src={video.thumbnail} alt={video.title} className="h-44 w-full object-cover" />
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-[#FF7800]">
          <span>{video.category}</span>
          <span>{video.level}</span>
        </div>
        <h3 className="text-lg font-bold text-[#0B1F33]">{video.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{video.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{video.duration}</span>
          <span>{video.provider}</span>
        </div>
        <button type="button" className="mt-5 inline-flex rounded-full bg-[#0B1F33] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#142f4d]">
          Watch Video
        </button>
      </div>
    </article>
  )
}

export default VideoCard
