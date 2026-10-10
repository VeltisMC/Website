import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, FileText, Globe, Code, ArrowRight } from 'lucide-react'
import { searchSite } from '../../services/searchIndex'
import type { SearchResultItem } from '../../types/search'

export interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const results = query.trim() ? searchSite(query) : searchSite('getting started')

  const handleSelect = (item: SearchResultItem) => {
    setQuery('')
    setSelectedIndex(0)
    onClose()
    if (item.url.startsWith('http')) {
      window.open(item.url, '_blank')
    } else {
      navigate(item.url)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-brand-border bg-[#0d1019] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-brand-border bg-[#111522]">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search documentation, guides, downloads, and architecture..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 hover:text-white text-slate-400 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/5">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No results found for &ldquo;<span className="text-slate-300">{query}</span>&rdquo;
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-violet-950/40 border border-violet-500/30' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start space-x-3 pr-4">
                    <div className="mt-0.5 p-1.5 rounded bg-white/5 text-slate-400">
                      {item.category === 'Documentation' ? (
                        <FileText className="w-4 h-4 text-violet-400" />
                      ) : item.category === 'API' ? (
                        <Code className="w-4 h-4 text-sky-400" />
                      ) : (
                        <Globe className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">{item.title}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 text-slate-500 transition-opacity ${
                      isSelected ? 'opacity-100 text-violet-400' : 'opacity-0'
                    }`}
                  />
                </div>
              )
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#090b12] border-t border-brand-border flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1 py-0.5 bg-slate-800 rounded">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 bg-slate-800 rounded">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-slate-800 rounded">ENTER</kbd> to select
            </span>
          </div>
          <span>Veltis Knowledge Index</span>
        </div>
      </div>
    </div>
  )
}
