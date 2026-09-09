const VideoSearch = ({ value, onChange, placeholder = 'Search videos...' }) => {
  return (
    <div className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search videos"
        className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </div>
  )
}

export default VideoSearch
