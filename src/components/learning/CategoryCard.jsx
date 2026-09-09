import { Link } from 'react-router-dom'

const CategoryCard = ({ title, description, icon, path }) => {
  return (
    <Link to={path} className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#FF7800] hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4F6F8] text-2xl text-[#0B1F33] transition group-hover:bg-[#FF7800] group-hover:text-white">{icon}</div>
      <h3 className="text-xl font-bold text-[#0B1F33]">{title}</h3>
      <p className="mt-3 text-sm text-slate-600">{description}</p>
      <div className="mt-5 inline-flex text-sm font-semibold text-[#FF7800]">Explore →</div>
    </Link>
  )
}

export default CategoryCard
