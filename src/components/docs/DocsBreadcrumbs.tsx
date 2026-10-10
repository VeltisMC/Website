import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { DocArticle } from '../../types/docs'

export interface DocsBreadcrumbsProps {
  article: DocArticle
}

export default function DocsBreadcrumbs({ article }: DocsBreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-4" aria-label="Breadcrumb">
      <Link to="/docs" className="hover:text-slate-300">
        Docs
      </Link>
      <ChevronRight className="w-3 h-3 text-slate-600" />
      <span className="text-slate-400">{article.section}</span>
      <ChevronRight className="w-3 h-3 text-slate-600" />
      <span className="text-violet-400 truncate max-w-[200px]">{article.title}</span>
    </nav>
  )
}
