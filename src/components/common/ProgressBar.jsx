const ProgressBar = ({ value, height = 'h-2.5', label, showValue = true }) => {
  return (
    <div>
      {label || showValue ? (
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          {label ? <span>{label}</span> : <span>Progress</span>}
          {showValue ? <span>{value}%</span> : null}
        </div>
      ) : null}
      <div className={`w-full overflow-hidden rounded-full bg-slate-200 ${height}`}>
        <div
          className="h-full rounded-full bg-[#FF7800] transition-all duration-300"
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
