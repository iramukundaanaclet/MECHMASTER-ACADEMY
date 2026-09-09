import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(11,31,51,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(11,31,51,0.12)]">
      <img src={course.image} alt={course.title} className="h-48 w-full object-cover" />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.15em] text-[#FF7800]">
          <span>{course.category}</span>
          <span>{course.level}</span>
        </div>
        <h3 className="text-xl font-bold text-[#0B1F33]">{course.title}</h3>
        <p className="mt-3 text-sm text-slate-600">{course.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>{course.lessons} lessons</span>
          <span>{course.progress}% complete</span>
        </div>
        <Link to={`/courses/${course.id}`} className="mt-5 inline-flex rounded-full bg-[#FF7800] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e56c00]">
          View Course
        </Link>
      </div>
    </article>
  )
}

export default CourseCard
