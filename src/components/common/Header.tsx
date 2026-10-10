import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Download, Search, Menu, X } from 'lucide-react'
import GithubIcon from './GithubIcon'
import DiscordIcon from './DiscordIcon'
import { siteConfig } from '../../config/site'
import { mainNav } from '../../config/navigation'

export interface HeaderProps {
  onOpenSearch: () => void
}

export default function Header({ onOpenSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-border bg-[#090a0f]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="Veltis logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-violet-300 transition-colors">
                {siteConfig.name}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {mainNav.map((item) => {
              const isActive =
                item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-violet-500/15 border border-violet-500/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-md border border-brand-border bg-[#111420] text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-xs font-mono"
            aria-label="Search documentation"
          >
            <Search className="w-3.5 h-3.5 text-violet-400" />
            <span>Search...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">
              Ctrl K
            </kbd>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Discord Link */}
          <a
            href={siteConfig.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Veltis Discord Community"
          >
            <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
          </a>

          {/* GitHub Link */}
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Veltis GitHub Repository"
          >
            <GithubIcon className="w-5 h-5" />
          </a>

          {/* Prominent Download CTA */}
          <Link
            to="/downloads"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium shadow-sm transition-all hover:shadow-violet-600/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-brand-border bg-[#0d0f17] px-4 pt-2 pb-6 space-y-1">
          {mainNav.map((item) => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                  isActive
                    ? 'text-white bg-violet-600/20 text-violet-300 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between px-3">
            <a
              href={siteConfig.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-[#5865F2] hover:text-white"
            >
              <DiscordIcon className="w-4 h-4" />
              <span>Discord</span>
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
