import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class AppErrorBoundary extends Component {
  state = { hasError: false, message: '' }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error instanceof Error ? error.message : 'Unknown application error' }
  }

  componentDidCatch(error) {
    console.error('Application failed to render:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#F4F6F8] px-6 text-center text-[#0B1F33]">
          <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold">MECHMASTER is temporarily unavailable</h1>
            <p className="mt-3 text-slate-600">Reload the page. If the problem continues, check the deployment settings and browser console.</p>
            {this.state.message ? <p className="mt-4 break-words text-xs text-slate-400">{this.state.message}</p> : null}
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  )
}
