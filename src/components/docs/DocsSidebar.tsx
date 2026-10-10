import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Server, Layers, ArrowLeftRight } from 'lucide-react'
import { docSections, getDocsBySection } from '../../content/docs'
import type { DocSection } from '../../types/docs'

export interface DocsSidebarProps {
  onCloseMobile?: () => void
}

export default function DocsSidebar({ onCloseMobile }: DocsSidebarProps) {
  const location = useLocation()
  const currentSlug = location.pathname.replace('/docs/', '').replace('/docs', '') || 'introduction'

  const sectionIcons: Record<DocSection, React.ReactNode> = {
    'Getting Started': <BookOpen className="w-4 h-4 text-violet-400" />,
    'Server Administration': <Server className="w-4 h-4 text-sky-400" />,
    Architecture: <Layers className="w-4 h-4 text-emerald-400" />,
    Migration: <ArrowLeftRight className="w-4 h-4 text-amber-400" />,
  }

  return (
    <aside className="w-full h-full py-6 pr-4 overflow-y-auto space-y-6 text-sm">
      {docSections.map((section) => {
        const docs = getDocsBySection(section)
        return (
          <div key={section} className="space-y-2">
            <div className="flex items-center space-x-2 px-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              {sectionIcons[section]}
              <span>{section}</span>
            </div>
            <ul className="space-y-1 pl-2 border-l border-white/5 ml-3">
              {docs.map((doc) => {
                const isActive = currentSlug === doc.slug
                return (
                  <li key={doc.slug}>
                    <Link
                      to={`/docs/${doc.slug}`}
                      onClick={onCloseMobile}
                      className={`block px-3 py-1.5 rounded-md text-xs transition-colors ${
                        isActive
                          ? 'bg-violet-600/20 text-violet-300 font-semibold border-l-2 border-violet-500'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {doc.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </aside>
  )
}
