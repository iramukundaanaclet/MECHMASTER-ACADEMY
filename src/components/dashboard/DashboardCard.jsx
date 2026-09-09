const DashboardCard = ({ title, value, subtitle, children }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-[#0B1F33]">{value}</h3>
        </div>
        {children}
      </div>
      {subtitle ? <p className="mt-3 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  )
}

export default DashboardCard
