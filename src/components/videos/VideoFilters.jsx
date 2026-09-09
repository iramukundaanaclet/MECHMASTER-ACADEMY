const vehicleOptions = ['All', 'Automotive', 'Motorcycle']
const categoryOptions = ['All', 'Engine', 'Brakes', 'Electrical', 'Transmission', 'Suspension', 'Diagnostics', 'Body Repair', 'HVAC', 'Vehicle Fundamentals', 'Fuel System', 'Motorcycle Fundamentals', 'Wheels & Tires']
const levelOptions = ['All', 'Beginner', 'Intermediate', 'Advanced']

const VideoFilters = ({ filters, onChange }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label htmlFor="vehicle-filter" className="mb-2 block text-sm font-medium text-[#0B1F33]">Vehicle type</label>
        <select id="vehicle-filter" value={filters.vehicleType} onChange={(event) => onChange('vehicleType', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#FF7800]">
          {vehicleOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category-filter" className="mb-2 block text-sm font-medium text-[#0B1F33]">Category</label>
        <select id="category-filter" value={filters.category} onChange={(event) => onChange('category', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#FF7800]">
          {categoryOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="level-filter" className="mb-2 block text-sm font-medium text-[#0B1F33]">Difficulty</label>
        <select id="level-filter" value={filters.level} onChange={(event) => onChange('level', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#FF7800]">
          {levelOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default VideoFilters
