import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CourseCard from './components/courses/CourseCard'
import CategoryCard from './components/learning/CategoryCard'
import VideoCard from './components/videos/VideoCard'
import VideoFilters from './components/videos/VideoFilters'
import VideoSearch from './components/videos/VideoSearch'
import YouTubePlayer from './components/videos/YouTubePlayer'
import DiagnosticFlow from './components/diagnostics/DiagnosticFlow'
import DashboardCard from './components/dashboard/DashboardCard'
import ProgressBar from './components/common/ProgressBar'
import Button from './components/common/Button'
import SectionTitle from './components/common/SectionTitle'
import courses from './data/courses'
import automotiveTopics from './data/automotiveTopics'
import motorcycleTopics from './data/motorcycleTopics'
import videos from './data/videos'
import diagnostics from './data/diagnostics'
import quizzes from './data/quizzes'
import resources from './data/resources'
import news from './data/news'
import { createVideo, deleteVideo, getAdminSession, getAllVideos, getPublishedVideos, isVideoDuplicate, signInAdmin, signOutAdmin } from './services/videoService'
import { getYouTubeId, getYouTubeThumbnail, isValidYouTubeUrl } from './utils/youtube'

const adminSessionStorageKey = 'mechmaster-admin-session'
const categoryCards = [
  { title: 'Automotive', description: 'Vehicle fundamentals, powertrains, electrical and repair systems.', icon: '🚗', path: '/automotive' },
  { title: 'Motorcycle', description: 'Two- and four-stroke systems, brakes, fuel and electrical learning.', icon: '🏍️', path: '/motorcycle' },
  { title: 'Repair', description: 'Practical repair workflow from inspection to testing and verification.', icon: '🧰', path: '/learn' },
  { title: 'Electrical', description: 'Batteries, wiring, sensors, actuators and electronic diagnostics.', icon: '⚡', path: '/learn' },
  { title: 'Diagnostics', description: 'Symptom-driven troubleshooting with logical step-by-step thinking.', icon: '🔎', path: '/diagnostics' },
  { title: 'Theory', description: 'Mechanical laws, concepts and engineering fundamentals in plain language.', icon: '📘', path: '/learn' },
  { title: 'Video Lessons', description: 'Watch practical demonstrations across workshop and service topics.', icon: '🎥', path: '/videos' },
]

const lessonLibrary = [
  { id: 'battery-basics', title: 'Battery Basics', category: 'Electrical', objective: 'Identify battery types, testing principles and safe handling.', image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80' },
  { id: 'brake-inspection', title: 'Brake Inspection', category: 'Repair', objective: 'Inspect pads, rotors, fluid, and braking performance issues safely.', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80' },
  { id: 'engine-oil-system', title: 'Engine Lubrication', category: 'Engine', objective: 'Understand oil flow, protection, contamination and service intervals.', image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80' },
]

const dashboardCourses = [
  { title: 'Automotive Electrical Systems', percent: 80, type: 'Course' },
  { title: 'Vehicle Diagnostics', percent: 65, type: 'Course' },
  { title: 'Motorcycle Technology', percent: 52, type: 'Course' },
]

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminSession, setAdminSession] = useState(() => {
    try {
      const saved = localStorage.getItem(adminSessionStorageKey)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    async function restoreSession() {
      const { data } = await getAdminSession()
      if (data?.session?.user) {
        setAdminSession({ email: data.session.user.email })
      }
    }

    restoreSession()
  }, [])

  useEffect(() => {
    if (adminSession) {
      localStorage.setItem(adminSessionStorageKey, JSON.stringify(adminSession))
      return
    }

    localStorage.removeItem(adminSessionStorageKey)
  }, [adminSession])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F4F6F8] text-slate-700">
        <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/automotive" element={<AutomotivePage />} />
            <Route path="/motorcycle" element={<MotorcyclePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage adminSession={adminSession} onLogin={setAdminSession} />} />
            <Route path="/admin/videos" element={adminSession ? <AdminVideosPage adminSession={adminSession} onLogout={() => setAdminSession(null)} /> : <LoginPage adminSession={adminSession} onLogin={setAdminSession} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/certificate/:id" element={<CertificatePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []

    const term = searchTerm.toLowerCase()
    const records = [
      ...courses.map((course) => ({ ...course, type: 'Course', category: course.category, description: course.description })),
      ...videos.map((video) => ({ ...video, type: 'Video', category: video.category, description: video.description })),
      ...resources.map((resource) => ({ ...resource, type: 'Resource', category: resource.category, description: resource.description })),
      ...diagnostics.map((item) => ({ ...item, title: item.symptom, type: 'Diagnostic', category: item.category, description: item.solution })),
      ...lessonLibrary.map((lesson) => ({ ...lesson, title: lesson.title, type: 'Lesson', category: lesson.category, description: lesson.objective })),
    ]

    return records.filter((entry) => {
      const haystack = [entry.title, entry.category, entry.type, entry.description, entry.symptom].join(' ').toLowerCase()
      return haystack.includes(term)
    })
  }, [searchTerm])

  return (
    <>
      <section className="bg-[#0B1F33] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit rounded-full border border-[#FF7800]/40 bg-[#102847] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FFB57A]">
              MECHMASTER ACADEMY
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Master Every Machine. Master Every Skill.</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Learn automotive and motorcycle technology through structured lessons, videos, diagrams, diagnostics and practical repair knowledge.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/courses" className="inline-flex items-center justify-center rounded-full bg-[#FF7800] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#e56c00]">Start Learning</Link>
              <Link to="/videos" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10">Explore Courses</Link>
            </div>
          </div>

          <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-br from-[#112b49] to-[#0a1d31] p-4 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
              alt="Vehicle workshop"
              className="h-[420px] w-full rounded-[22px] object-cover"
            />
            <div className="absolute -bottom-5 left-8 right-8 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF7800]">Learning path</p>
                <span className="rounded-full bg-[#F4F6F8] px-2.5 py-1 text-xs font-semibold text-[#0B1F33]">Learn → Watch → Practice → Test</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
                <span>Automotive</span>
                <span>•</span>
                <span>Motorcycle</span>
                <span>•</span>
                <span>Diagnostics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionTitle eyebrow="Search" title="Find the right skill path" description="Search for courses, lessons, videos, diagnostics and workshop resources." />
          <div className="w-full max-w-md rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search for alternator, brakes, diagnostics..."
              aria-label="Search learning content"
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {searchTerm ? (
          <div className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-semibold text-[#0B1F33]">Search results for “{searchTerm}”</p>
              <span className="text-sm text-slate-500">{searchResults.length} result(s)</span>
            </div>
            {searchResults.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {searchResults.slice(0, 6).map((result) => (
                  <div key={`${result.type}-${result.title}`} className="rounded-2xl border border-slate-200 bg-[#F4F6F8] p-4">
                    <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FF7800]">
                      <span>{result.type}</span>
                      <span>{result.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0B1F33]">{result.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{result.description}</p>
                    <Link to={result.type === 'Course' ? `/courses/${result.id}` : result.type === 'Video' ? '/videos' : result.type === 'Lesson' ? '/lesson/battery-basics' : result.type === 'Resource' ? '/resources' : '/diagnostics'} className="mt-4 inline-flex rounded-full bg-[#0B1F33] px-3 py-2 text-xs font-semibold text-white">View</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F4F6F8] p-6 text-center text-slate-600">No results found. Try searching for alternator, brake, engine or diagnostics.</div>
            )}
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categoryCards.map((item) => (
            <CategoryCard key={item.title} title={item.title} description={item.description} icon={item.icon} path={item.path} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Why MechMaster" title="A learning platform designed for real workshop thinking" description="Structured education, practical repair logic, diagnostics and mechanical skills built for students, technicians and enthusiasts." centered />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              'Structured learning paths across automotive and motorcycle systems',
              'Practical knowledge and safety-focused repair habits',
              'Video lessons, diagnostics, quizzes and workshop-ready resources',
              'Clear explanations for beginners and deeper technical coverage for advanced learners',
              'System-by-system understanding instead of random disconnected information',
              'Future-ready architecture for real courses, certification and student tracking',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-[#F4F6F8] p-5 text-base font-medium text-[#0B1F33] shadow-sm">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Featured courses" title="Build your mechanical skill foundation" description="A preview of learning tracks for automotive and motorcycle growth." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {courses.slice(0, 8).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </>
  )
}

function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Learning Center" title="Organized mechanical knowledge by discipline" description="Explore the main categories and move from fundamentals to repair, diagnostics and practical application." />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categoryCards.map((item) => (
          <CategoryCard key={item.title} title={item.title} description={item.description} icon={item.icon} path={item.path} />
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-[#0B1F33]">Recommended learning flow</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {['Learn', 'Watch', 'Practice', 'Test', 'Complete'].map((step, index) => (
            <div key={step} className="rounded-2xl bg-[#F4F6F8] p-4 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF7800] font-bold text-white">{index + 1}</div>
              <p className="font-semibold text-[#0B1F33]">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AutomotivePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Automotive Learning" title="Vehicle systems, engine knowledge and service fundamentals" description="A structured breakdown of automotive training categories from basics to diagnostics." />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {automotiveTopics.map((group) => (
          <div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B1F33]">{group.title}</h3>
            <ul className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
              {group.topics.map((topic) => (
                <li key={topic} className="rounded-xl bg-[#F4F6F8] px-3 py-2">{topic}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function MotorcyclePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Motorcycle Academy" title="Motorcycle systems and repair knowledge" description="An independent path dedicated to motorcycle fundamentals, powertrain, electrical and diagnostics." />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {motorcycleTopics.map((group) => (
          <div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B1F33]">{group.title}</h3>
            <ul className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
              {group.topics.map((topic) => (
                <li key={topic} className="rounded-xl bg-[#F4F6F8] px-3 py-2">{topic}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses
    const term = searchTerm.toLowerCase()
    return courses.filter((course) => `${course.title} ${course.category} ${course.level}`.toLowerCase().includes(term))
  }, [searchTerm])

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Courses" title="Structured learning programs" description="Choose a topic, move through lessons and keep building practical mechanical skill." />
      <div className="mt-8 max-w-md rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} aria-label="Filter courses" placeholder="Search courses..." className="w-full border-0 bg-transparent text-sm outline-none" />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      {!filteredCourses.length ? <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">No course matches your search.</div> : null}
    </div>
  )
}

function CourseDetailsPage() {
  const params = useParams()
  const course = courses.find((item) => item.id === params.id)

  if (!course) return <NotFoundPage />

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-slate-500">
        <Link to="/" className="hover:text-[#0B1F33]">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/courses" className="hover:text-[#0B1F33]">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-[#0B1F33]">{course.title}</span>
      </nav>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <img src={course.image} alt={course.title} className="h-72 w-full object-cover" />
        <div className="p-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7800]">
            <span>{course.category}</span>
            <span>•</span>
            <span>{course.level}</span>
          </div>
          <h1 className="mt-4 text-4xl font-black text-[#0B1F33]">{course.title}</h1>
          <p className="mt-4 max-w-3xl text-slate-600">{course.description}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/dashboard" className="inline-flex items-center justify-center rounded-full bg-[#FF7800] px-6 py-3 font-semibold text-white">Start / Continue</Link>
            <Link to={`/quiz/${course.id}`} className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-[#0B1F33]">Take Quiz</Link>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-2xl font-bold text-[#0B1F33]">Course overview</h2>
              <ul className="mt-5 space-y-3 text-slate-600">
                {course.lessonsList.map((lesson) => (
                  <li key={lesson} className="rounded-xl bg-[#F4F6F8] px-4 py-3">{lesson}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[#F4F6F8] p-5">
              <h3 className="text-lg font-bold text-[#0B1F33]">Progress</h3>
              <div className="mt-4">
                <ProgressBar value={course.progress} label="Course completion" />
              </div>
              <div className="mt-6 text-sm text-slate-600">
                <p>{course.lessons} total lessons</p>
                <p className="mt-2">Suggested next step: {course.lessonsList[0]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LessonPage() {
  const params = useParams()
  const lesson = lessonLibrary.find((item) => item.id === params.id) || lessonLibrary[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-[#0B1F33]">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/courses" className="hover:text-[#0B1F33]">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-[#0B1F33]">Lesson</span>
      </nav>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7800]">
          <span>{lesson.category}</span>
          <span>•</span>
          <span>Lesson</span>
        </div>
        <h1 className="mt-4 text-4xl font-black text-[#0B1F33]">{lesson.title}</h1>
        <p className="mt-4 max-w-2xl text-slate-600"><strong>Learning objective:</strong> {lesson.objective}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="rounded-2xl border border-slate-200 bg-[#F4F6F8] p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#0B1F33]">Main lesson content</p>
              <p className="text-slate-600">This lesson explains the system components, how they work together, and what to inspect when a fault appears. It is intentionally presented as a structured educational module for a future online classroom.</p>
            </div>
            <img src={lesson.image} alt={lesson.title} className="mt-6 h-72 w-full rounded-2xl object-cover" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-[#0B1F33]">Practical notes</h3>
                <p className="mt-2 text-sm text-slate-600">Check for wear, contamination, voltage drops and correct fitment before replacing parts.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-[#0B1F33]">Safety notes</h3>
                <p className="mt-2 text-sm text-slate-600">Wear PPE, isolate the vehicle correctly and follow the relevant safety procedures.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-[#F4F6F8] p-4">
              <h3 className="font-bold text-[#0B1F33]">Common mistakes</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
                <li>Skipping inspection before replacement</li>
                <li>Ignoring safety procedures</li>
                <li>Misreading measurement values</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-[#F4F6F8] p-4">
              <h3 className="font-bold text-[#0B1F33]">Video area</h3>
              <div className="mt-3 rounded-xl bg-[#0B1F33] p-4 text-center text-sm font-medium text-white">Demo lesson video placeholder</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-[#F4F6F8] p-4">
              <h3 className="font-bold text-[#0B1F33]">Navigation</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" className="rounded-full bg-[#0B1F33] px-4 py-2 text-sm font-semibold text-white">Previous lesson</button>
                <button type="button" className="rounded-full bg-[#FF7800] px-4 py-2 text-sm font-semibold text-white">Next lesson</button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to={`/quiz/${lesson.category.toLowerCase() || 'alternator-quiz'}`} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0B1F33]">Quiz</Link>
                <button type="button" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0B1F33]">Mark as completed</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function VideosPage() {
  const [allVideos, setAllVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ vehicleType: 'All', category: 'All', level: 'All' })

  useEffect(() => {
    let isMounted = true

    async function loadVideos() {
      const publishedVideos = await getPublishedVideos()

      if (!isMounted) return

      const safeVideos = publishedVideos.length ? publishedVideos : videos
      setAllVideos(safeVideos)
      setSelectedVideo(safeVideos[0] || null)
      setLoading(false)
    }

    loadVideos()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredVideos = useMemo(() => {
    return allVideos.filter((video) => {
      const videoType = video.vehicle_type || video.category || 'Automotive'
      const category = video.category || 'General'
      const level = video.level || 'Beginner'
      const title = (video.title || '').toLowerCase()
      const description = (video.description || '').toLowerCase()
      const matchesSearch = !searchTerm || title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())
      const matchesVehicle = filters.vehicleType === 'All' || videoType === filters.vehicleType
      const matchesCategory = filters.category === 'All' || category === filters.category
      const matchesLevel = filters.level === 'All' || level === filters.level

      return matchesSearch && matchesVehicle && matchesCategory && matchesLevel
    })
  }, [allVideos, searchTerm, filters])

  useEffect(() => {
    if (!filteredVideos.length) {
      setSelectedVideo(null)
      return
    }

    if (!selectedVideo || !filteredVideos.some((video) => video.id === selectedVideo.id)) {
      setSelectedVideo(filteredVideos[0])
    }
  }, [filteredVideos, selectedVideo])

  const selectedVideoId = selectedVideo
    ? getYouTubeId(selectedVideo.youtube_video_id || selectedVideo.youtube_url || '')
    : ''

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Video Lessons" title="Watch practical mechanical learning content" description="A modern library of automotive, motorcycle and diagnostic video lessons for workshop skill building." />

      <div className="mt-8 flex flex-col gap-4">
        <VideoSearch value={searchTerm} onChange={setSearchTerm} />
        <VideoFilters filters={filters} onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {loading ? (
            <div className="rounded-2xl bg-[#F4F6F8] p-8 text-center text-slate-600">Loading published videos...</div>
          ) : selectedVideo ? (
            <>
              <YouTubePlayer videoId={selectedVideoId} title={selectedVideo.title} />
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FF7800]">
                  <span>{selectedVideo.category || selectedVideo.vehicle_type || 'General'}</span>
                  <span>•</span>
                  <span>{selectedVideo.level || 'Beginner'}</span>
                </div>
                <h3 className="mt-4 text-3xl font-black text-[#0B1F33]">{selectedVideo.title}</h3>
                <p className="mt-3 text-slate-600">{selectedVideo.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-[#F4F6F8] px-3 py-2">{selectedVideo.duration || 'Video lesson'}</span>
                  <span className="rounded-full bg-[#F4F6F8] px-3 py-2">{selectedVideo.vehicle_type || 'Automotive'}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F4F6F8] p-8 text-center text-slate-600">No videos match your current filters.</div>
          )}
        </div>

        <div className="space-y-4">
          {filteredVideos.length ? filteredVideos.map((video) => (
            <VideoCard key={video.id || video.youtube_video_id || video.youtube_url} video={video} onSelect={() => setSelectedVideo(video)} selected={selectedVideo?.id === video.id && selectedVideo?.youtube_video_id === video.youtube_video_id} />
          )) : null}
        </div>
      </div>
    </div>
  )
}

function AdminVideosPage({ adminSession, onLogout }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    youtube_url: '',
    bulk_urls: '',
    title: '',
    description: '',
    category: 'Engine',
    vehicle_type: 'Automotive',
    level: 'Beginner',
    published: true,
  })

  const refreshVideos = async () => {
    setLoading(true)
    const allVideos = await getAllVideos()
    setVideos(allVideos)
    setLoading(false)
  }

  useEffect(() => {
    refreshVideos()
  }, [])

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')

    if (!form.youtube_url || !isValidYouTubeUrl(form.youtube_url)) {
      setError('Please paste a valid YouTube URL.')
      return
    }

    const youtubeVideoId = getYouTubeId(form.youtube_url)
    const duplicate = await isVideoDuplicate(youtubeVideoId)
    if (duplicate) {
      setError('This video already exists in the library.')
      return
    }

    const payload = {
      youtube_url: form.youtube_url,
      youtube_video_id: youtubeVideoId,
      title: form.title.trim() || `Mechanical video ${Date.now().toString().slice(-4)}`,
      description: form.description.trim() || 'New workshop lesson added by admin.',
      category: form.category,
      vehicle_type: form.vehicle_type,
      level: form.level,
      duration: 'N/A',
      thumbnail_url: getYouTubeThumbnail(youtubeVideoId),
      provider: 'MechMaster Academy',
      published: form.published,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error: saveError } = await createVideo(payload)

    if (saveError) {
      setError(saveError.message || 'Unable to save the video right now.')
      return
    }

    const savedVideo = data || payload
    const merged = [savedVideo, ...videos]
    setVideos(merged)
    setForm({
      youtube_url: '',
      bulk_urls: '',
      title: '',
      description: '',
      category: 'Engine',
      vehicle_type: 'Automotive',
      level: 'Beginner',
      published: true,
    })
    setStatus('Video saved successfully and is now visible to visitors when published.')
  }

  const handleBulkAdd = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')

    const urls = String(form.bulk_urls || '')
      .split(/\r?\n|,|;/)
      .map((value) => value.trim())
      .filter(Boolean)

    if (!urls.length) {
      setError('Paste one or more YouTube links, one per line or separated by commas.')
      return
    }

    const validUrls = urls.filter((url) => isValidYouTubeUrl(url))

    if (!validUrls.length) {
      setError('No valid YouTube URLs were found in the input.')
      return
    }

    const existingVideos = [...videos]
    const allVideos = [...videos]
    let addedCount = 0
    const addedVideoIds = new Set()

    for (const url of validUrls) {
      const youtubeVideoId = getYouTubeId(url)
      const normalizedVideoId = youtubeVideoId?.toLowerCase()
      const alreadyExists = !normalizedVideoId || addedVideoIds.has(normalizedVideoId) || allVideos.some(
        (video) => typeof video.youtube_video_id === 'string' && video.youtube_video_id.toLowerCase() === normalizedVideoId
      )

      if (alreadyExists) continue

      const payload = {
        youtube_url: url,
        youtube_video_id: youtubeVideoId,
        title: `Mechanical video ${new Date().toISOString().slice(0, 10)}`,
        description: 'New workshop lesson added by admin.',
        category: form.category,
        vehicle_type: form.vehicle_type,
        level: form.level,
        duration: 'N/A',
        thumbnail_url: getYouTubeThumbnail(youtubeVideoId),
        provider: 'MechMaster Academy',
        published: form.published,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error: saveError } = await createVideo(payload)
      if (saveError) {
        setError(saveError.message || 'Unable to save videos to the shared database.')
        return
      }

      const savedVideo = data || payload
      existingVideos.unshift(savedVideo)
      allVideos.unshift(savedVideo)
      addedVideoIds.add(normalizedVideoId)
      addedCount += 1
    }

    setVideos(existingVideos)
    setForm((current) => ({ ...current, bulk_urls: '', youtube_url: '' }))

    if (!addedCount) {
      setError('All of the entered videos already exist in the library.')
      return
    }

    setStatus(`${addedCount} video${addedCount > 1 ? 's were' : ' was'} added successfully.`)
  }

  const handleDelete = async (videoId) => {
    await deleteVideo(videoId)
    const nextVideos = videos.filter((video) => video.id !== videoId)
    setVideos(nextVideos)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF7800]">Admin access</p>
          <h1 className="mt-2 text-4xl font-black text-[#0B1F33]">Video Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#F4F6F8] px-3 py-2 text-sm font-medium text-[#0B1F33]">{adminSession?.email}</span>
          <button type="button" onClick={onLogout} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0B1F33]">Logout</button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0B1F33]">Add new video</h2>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="youtube_url" className="mb-2 block text-sm font-medium text-[#0B1F33]">YouTube URL</label>
              <input id="youtube_url" name="youtube_url" value={form.youtube_url} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]" placeholder="https://www.youtube.com/watch?v=..." />
            </div>

            <div>
              <label htmlFor="bulk_urls" className="mb-2 block text-sm font-medium text-[#0B1F33]">Bulk YouTube URLs</label>
              <textarea id="bulk_urls" name="bulk_urls" value={form.bulk_urls} onChange={handleInputChange} rows="5" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]" placeholder="https://www.youtube.com/watch?v=...&#10;https://youtu.be/....&#10;https://www.youtube.com/watch?v=..." />
              <p className="mt-2 text-xs text-slate-500">Add multiple links at once, one per line or separated by commas.</p>
            </div>

            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-[#0B1F33]">Video title</label>
              <input id="title" name="title" value={form.title} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]" placeholder="Alternator Diagnosis for Beginners" />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-[#0B1F33]">Description</label>
              <textarea id="description" name="description" rows="4" value={form.description} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]" placeholder="Explain the lesson topic and what learners will take away." />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium text-[#0B1F33]">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]">
                  {['Engine', 'Brakes', 'Electrical', 'Transmission', 'Suspension', 'Diagnostics', 'Body Repair', 'General'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="vehicle_type" className="mb-2 block text-sm font-medium text-[#0B1F33]">Vehicle type</label>
                <select id="vehicle_type" name="vehicle_type" value={form.vehicle_type} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]">
                  {['Automotive', 'Motorcycle'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="level" className="mb-2 block text-sm font-medium text-[#0B1F33]">Level</label>
                <select id="level" name="level" value={form.level} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]">
                  {['Beginner', 'Intermediate', 'Advanced'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-[#0B1F33]">
              <input type="checkbox" name="published" checked={form.published} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-300 text-[#FF7800] focus:ring-[#FF7800]" />
              Publish this video on the public Videos page
            </label>

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
            {status ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div> : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="flex-1 rounded-full bg-[#FF7800] px-5 py-3 text-base font-semibold text-white">Save One Video</button>
              <button type="button" onClick={handleBulkAdd} className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-[#0B1F33]">Add Bulk Videos</button>
            </div>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-[#0B1F33]">Video library</h2>
          </div>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Videos are saved in the shared Firebase Realtime Database. Every visitor sees published videos from the same online library.
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl bg-[#F4F6F8] p-6 text-slate-600">Loading videos...</div>
          ) : (
            <div className="mt-6 space-y-4">
              {videos.length ? videos.map((video) => (
                <div key={video.id || video.youtube_video_id || video.youtube_url} className="rounded-2xl border border-slate-200 bg-[#F4F6F8] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF7800]">{video.category || 'General'}</p>
                      <h3 className="mt-2 text-lg font-bold text-[#0B1F33]">{video.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{video.vehicle_type || 'Automotive'} • {video.level || 'Beginner'} • {video.published ? 'Published' : 'Draft'}</p>
                    </div>
                    <button type="button" onClick={() => handleDelete(video.id)} className="rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600">Delete</button>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F4F6F8] p-6 text-center text-slate-600">No videos saved yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoginPage({ adminSession, onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  if (adminSession) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h1 className="text-3xl font-black text-[#0B1F33]">Admin logged in</h1>
          <p className="mt-3 text-slate-600">You are already authorized to manage videos.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/admin/videos" className="rounded-full bg-[#FF7800] px-5 py-3 font-semibold text-white">Open Video Manager</Link>
            <button type="button" onClick={async () => {
              await signOutAdmin()
              onLogin(null)
            }} className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-[#0B1F33]">Logout</button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { data, error: authError } = await signInAdmin(form.email, form.password)

    if (authError || !data?.user) {
      setError(authError?.message || 'Invalid admin email or password.')
      return
    }

    onLogin({ email: data.user.email || form.email.trim() })
    navigate('/admin/videos')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF7800]">Admin login</p>
        <h1 className="mt-2 text-3xl font-black text-[#0B1F33]">Login to Admin</h1>
        <p className="mt-3 text-slate-600">Use your admin credentials to access the video management workspace.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-[#0B1F33]">Email</label>
            <input id="admin-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]" placeholder="admin@mechmaster.local" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-[#0B1F33]">Password</label>
            <input id="admin-password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]" placeholder="••••••••" />
          </div>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <button type="submit" className="w-full rounded-full bg-[#FF7800] px-5 py-3 font-semibold text-white">Login to Admin</button>
        </form>
      </div>
    </div>
  )
}

function DiagnosticsPage() {
  const [selected, setSelected] = useState(diagnostics[0])

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Diagnostics Center" title="Problem → cause → test → solution" description="Use a structured troubleshooting flow to isolate faults and support better mechanical decision-making." />

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          {diagnostics.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className={`w-full rounded-2xl border p-4 text-left transition ${selected.id === item.id ? 'border-[#FF7800] bg-[#FFF3E8]' : 'border-slate-200 bg-white'}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7800]">{item.category}</p>
              <p className="mt-2 text-lg font-bold text-[#0B1F33]">{item.symptom}</p>
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7800]">Selected symptom</p>
          <h3 className="mt-3 text-3xl font-bold text-[#0B1F33]">{selected.symptom}</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-bold text-[#0B1F33]">Possible causes</h4>
              <ul className="mt-3 list-disc pl-5 text-slate-600">{selected.possibleCauses.map((cause) => <li key={cause}>{cause}</li>)}</ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0B1F33]">Test steps</h4>
              <ul className="mt-3 list-disc pl-5 text-slate-600">{selected.tests.map((test) => <li key={test}>{test}</li>)}</ul>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-[#F4F6F8] p-4">
            <h4 className="font-bold text-[#0B1F33]">Solution</h4>
            <p className="mt-2 text-slate-600">{selected.solution}</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <DiagnosticFlow diagnostics={diagnostics} />
      </div>
    </div>
  )
}

function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Tools & Resources" title="Support your learning with practical references" description="A structured set of tools, formulas and workshop references for ongoing mechanical learning." />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <div key={resource.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7800]">{resource.type}</p>
            <h3 className="mt-3 text-xl font-bold text-[#0B1F33]">{resource.title}</h3>
            <p className="mt-3 text-sm text-slate-600">{resource.description}</p>
            <div className="mt-5 inline-flex rounded-full bg-[#F4F6F8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0B1F33]">{resource.category}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Mechanic News" title="Sample news and learning articles" description="This area is intentionally structured as demo content for future updates and article management." />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {news.map((article) => (
          <article key={article.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7800]">{article.category}</p>
            <h3 className="mt-3 text-2xl font-bold text-[#0B1F33]">{article.title}</h3>
            <p className="mt-3 text-slate-600">{article.summary}</p>
            <p className="mt-4 rounded-xl bg-[#F4F6F8] p-3 text-sm text-slate-500">{article.preview}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function CommunityPage() {
  const sampleResponse = [
    { name: 'Mechanic Mentor', answer: 'Check battery voltage first, then fuel delivery and ignition, because cranking without fire usually points to a fuel or spark problem.' },
    { name: 'Service Guide', answer: 'Inspect spark, fuel pressure and crank signal before replacing expensive parts. Build a process instead of guessing.' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Ask a Mechanic" title="Community question example" description="A frontend concept for future community discussion. This is static demo content only." />

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7800]">Question</p>
        <h3 className="mt-3 text-2xl font-bold text-[#0B1F33]">“My Toyota is cranking but not starting. What should I check?”</h3>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-[#F4F6F8] px-3 py-2">Category: Diagnostics</span>
          <span className="rounded-full bg-[#F4F6F8] px-3 py-2">Vehicle: Automotive</span>
        </div>

        <div className="mt-8 space-y-5">
          {sampleResponse.map((response) => (
            <div key={response.name} className="rounded-2xl border border-slate-200 bg-[#F4F6F8] p-4">
              <p className="font-bold text-[#0B1F33]">{response.name}</p>
              <p className="mt-2 text-slate-600">{response.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h4 className="font-bold text-[#0B1F33]">Related lessons</h4>
          <div className="mt-3 flex flex-wrap gap-3">
            {['Starting systems', 'Fuel system checks', 'Spark diagnosis'].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="About" title="Developing confident mechanical learners" description="MECHMASTER ACADEMY is a conceptual educational platform built to teach practical mechanical awareness, diagnostics and service logic." />
      <div className="mt-10 space-y-6 text-slate-600">
        <p>It is designed for automotive and motorcycle students, technicians and enthusiasts who want to strengthen their understanding of mechanical systems in a clear and structured way.</p>
        <p>Rather than relying on scattered information, the platform organizes learning around the real flow of a mechanic’s thinking: learn the system, understand its purpose, inspect it, diagnose faults and validate the repair.</p>
        <p>Topics include vehicle fundamentals, engine systems, electrical and electronic troubleshooting, repair and maintenance, motorcycle technology, diagnostics and workshop safety.</p>
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Contact" title="Ask a question or start a conversation" description="The contact form is front-end only and uses placeholder values until real contact details are provided." />
      <div className="mt-10 grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#0B1F33]">Name</label>
            <input id="name" type="text" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]" placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#0B1F33]">Email</label>
            <input id="email" type="email" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]" placeholder="[EMAIL ADDRESS]" />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#0B1F33]">Message</label>
            <textarea id="message" rows="5" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF7800]" placeholder="Your message" />
          </div>
          <Button variant="primary">Send Message</Button>
        </form>

        <div className="rounded-2xl bg-[#0B1F33] p-6 text-white">
          <h3 className="text-xl font-bold">Contact details</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            <li>Email: [EMAIL ADDRESS]</li>
            <li>Phone: [PHONE NUMBER]</li>
            <li>WhatsApp: [WHATSAPP NUMBER]</li>
            <li>Address: [ADDRESS]</li>
          </ul>
          <a href="https://wa.me/" target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-[#FF7800] px-5 py-3 font-semibold text-white">WhatsApp</a>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF7800]">Student dashboard</p>
          <h1 className="mt-2 text-4xl font-black text-[#0B1F33]">Welcome back 👋</h1>
        </div>
        <Link to="/certificate/automotive-electrical-systems" className="rounded-full bg-[#0B1F33] px-5 py-3 text-sm font-semibold text-white">View Certificate</Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="My Courses" value="5" subtitle="Active learning tracks" />
        <DashboardCard title="Completed Lessons" value="18" subtitle="Across electrical, engine and diagnostics" />
        <DashboardCard title="Certificates" value="2" subtitle="Ready for review" />
        <DashboardCard title="Quiz Results" value="92%" subtitle="Average score" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0B1F33]">Continue Learning</h2>
          <div className="mt-6 space-y-4">
            {dashboardCourses.map((item) => (
              <div key={item.title} className="rounded-2xl bg-[#F4F6F8] p-4">
                <div className="mb-3 flex justify-between text-sm font-medium text-[#0B1F33]">
                  <span>{item.title}</span>
                  <span>{item.percent}%</span>
                </div>
                <ProgressBar value={item.percent} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0B1F33]">Saved Lessons</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Battery Basics</li>
              <li>• Brake Inspection</li>
              <li>• Engine Lubrication</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0B1F33]">Learning Progress</h2>
            <div className="mt-4">
              <ProgressBar value={74} label="Overall progress" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuizPage() {
  const params = useParams()
  const selectedQuiz = quizzes.find((quiz) => quiz.id === params.id) || quizzes[0]
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const question = selectedQuiz.questions[currentQuestion]

  const handleSubmit = () => {
    if (selectedAnswer === question.answer) {
      setScore((value) => value + 1)
    }
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion((value) => value + 1)
      setSelectedAnswer('')
    } else {
      setSubmitted(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setSubmitted(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7800]">Quiz</p>
            <h1 className="mt-2 text-3xl font-black text-[#0B1F33]">{selectedQuiz.title}</h1>
          </div>
          <span className="rounded-full bg-[#F4F6F8] px-4 py-2 text-sm font-semibold text-[#0B1F33]">Question {currentQuestion + 1}/{selectedQuiz.questions.length}</span>
        </div>

        {submitted ? (
          <div>
            <h2 className="text-2xl font-bold text-[#0B1F33]">Score: {score}/{selectedQuiz.questions.length}</h2>
            <p className="mt-4 text-slate-600">Great effort. Review the lesson and continue building the skill step by step.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={handleRestart} className="rounded-full bg-[#FF7800] px-5 py-3 font-semibold text-white">Restart Quiz</button>
              <Link to="/dashboard" className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-[#0B1F33]">Continue Learning</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xl font-semibold text-[#0B1F33]">{question.question}</p>
            <div className="mt-6 space-y-3">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedAnswer(option)}
                  className={`block w-full rounded-2xl border px-4 py-3 text-left text-base transition ${selectedAnswer === option ? 'border-[#FF7800] bg-[#FFF3E8] text-[#0B1F33]' : 'border-slate-200 bg-[#F4F6F8] text-slate-700 hover:border-slate-300'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={handleSubmit} className="rounded-full bg-[#FF7800] px-5 py-3 font-semibold text-white" disabled={!selectedAnswer}>Next</button>
              <button type="button" onClick={handleRestart} className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-[#0B1F33]">Restart</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CertificatePage() {
  const { id } = useParams()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border-[6px] border-[#FF7800] bg-white p-10 text-center shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF7800]">MECHMASTER ACADEMY</p>
        <h1 className="mt-4 text-4xl font-black text-[#0B1F33]">Certificate of Completion</h1>
        <p className="mt-6 text-slate-600">This certifies that</p>
        <p className="mt-3 text-3xl font-bold text-[#0B1F33]">Student Name</p>
        <p className="mt-6 text-slate-600">successfully completed</p>
        <p className="mt-2 text-2xl font-bold text-[#FF7800]">{id ? id.replace(/-/g, ' ') : 'Automotive Electrical Systems'}</p>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <h1 className="text-5xl font-black text-[#0B1F33]">404</h1>
      <p className="mt-4 text-xl text-slate-600">The page you are looking for could not be found.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-[#FF7800] px-6 py-3 font-semibold text-white">Back to Home</Link>
    </div>
  )
}

export default App
