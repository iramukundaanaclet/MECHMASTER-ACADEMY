import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

const footerGroups = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Learn', to: '/learn' },
      { label: 'Courses', to: '/courses' },
      { label: 'Videos', to: '/videos' },
      { label: 'Diagnostics', to: '/diagnostics' },
    ],
  },
  {
    title: 'Learning',
    links: [
      { label: 'Automotive', to: '/automotive' },
      { label: 'Motorcycle', to: '/motorcycle' },
      { label: 'Repair & Maintenance', to: '/learn' },
      { label: 'Electrical', to: '/learn' },
      { label: 'Body Repair', to: '/learn' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Resources', to: '/resources' },
      { label: 'News', to: '/news' },
      { label: 'Community', to: '/community' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

const Footer = () => {
  return (
    <footer className="bg-[#0B1F33] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF7800] font-black text-white">M</div>
            <div>
              <div className="text-lg font-black uppercase tracking-[0.18em]">MECHMASTER</div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#FFB57A]">ACADEMY</div>
            </div>
          </div>
          <p className="max-w-xs text-sm text-slate-300">
            Master Every Machine. Master Every Skill.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#FFB57A]">{group.title}</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#FFB57A]">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>[EMAIL ADDRESS]</li>
            <li>[PHONE NUMBER]</li>
            <li>[WHATSAPP NUMBER]</li>
            <li>[ADDRESS]</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-slate-300 sm:flex-row sm:px-6 lg:px-8">
          <p>© {currentYear} MECHMASTER ACADEMY. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span>[SOCIAL LINK]</span>
            <span>[SOCIAL LINK]</span>
            <span>[SOCIAL LINK]</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
