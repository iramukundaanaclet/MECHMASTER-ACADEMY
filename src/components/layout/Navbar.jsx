import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Learn', to: '/learn' },
  { label: 'Courses', to: '/courses' },
  { label: 'Videos', to: '/videos' },
  { label: 'Diagnostics', to: '/diagnostics' },
  { label: 'Motorcycle', to: '/motorcycle' },
  { label: 'Resources', to: '/resources' },
  { label: 'About', to: '/about' },
]

const learnSubmenu = [
  'Automotive',
  'Motorcycle',
  'Repair & Maintenance',
  'Electrical',
  'Diagnostics',
  'Body Repair',
  'Engineering Fundamentals',
]

const Navbar = ({ mobileOpen, setMobileOpen }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="MECHMASTER ACADEMY home">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F33] text-lg font-black text-white">M</div>
          <div>
            <div className="text-lg font-black uppercase tracking-[0.14em] text-[#0B1F33]">MECHMASTER</div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#FF7800]">ACADEMY</div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="group relative">
            <button type="button" className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-[#0B1F33]">
              Learn <span className="text-xs">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              {learnSubmenu.map((item) => (
                <Link key={item} to="/learn" className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-[#F4F6F8] hover:text-[#0B1F33]">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {navItems.filter((item) => item.label !== 'Learn').map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-[#FF7800]' : 'text-slate-700 hover:text-[#0B1F33]'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className="text-sm font-medium text-slate-700 transition hover:text-[#0B1F33]">Login</Link>
          <Link to="/dashboard" className="rounded-full bg-[#FF7800] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e56c00]">
            Start Learning
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-[#0B1F33] lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#F4F6F8]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#F4F6F8]" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link to="/dashboard" className="rounded-lg bg-[#FF7800] px-3 py-2.5 text-center text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>Start Learning</Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
