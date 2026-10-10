import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import SearchModal from '../components/common/SearchModal'

export default function RootLayout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-slate-100 selection:bg-violet-600/30 selection:text-violet-200">
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
