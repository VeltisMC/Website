import { useState, useEffect } from 'react'
import type { DocHeading } from '../../types/docs'
import { AlignLeft } from 'lucide-react'

export interface DocsTocProps {
  headings: DocHeading[]
}

export default function DocsToc({ headings }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollY = window.scrollY + 120
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id)
        if (el && el.offsetTop <= scrollY) {
          setActiveId(headings[i].id)
          return
        }
      }
      setActiveId(headings[0].id)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center space-x-2 text-slate-300 font-mono font-semibold uppercase tracking-wider">
        <AlignLeft className="w-3.5 h-3.5 text-violet-400" />
        <span>On this page</span>
      </div>
      <ul className="space-y-2 border-l border-white/5 pl-3">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          return (
            <li key={heading.id} className={heading.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${heading.id}`}
                className={`block transition-colors ${
                  isActive
                    ? 'text-violet-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {heading.title}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
