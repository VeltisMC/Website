import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { DocArticle } from '../../types/docs'

export interface DocsPagerProps {
  prev?: DocArticle
  next?: DocArticle
}

export default function DocsPager({ prev, next }: DocsPagerProps) {
  return (
    <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
      {prev ? (
        <Link
          to={`/docs/${prev.slug}`}
          className="flex items-center space-x-3 p-3 rounded-lg border border-brand-border bg-brand-surface hover:border-slate-600 transition-colors w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 text-violet-400 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Previous</span>
            <span className="text-xs font-medium text-white">{prev.title}</span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to={`/docs/${next.slug}`}
          className="flex items-center space-x-3 p-3 rounded-lg border border-brand-border bg-brand-surface hover:border-slate-600 transition-colors w-full sm:w-auto text-right justify-end ml-auto"
        >
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Next</span>
            <span className="text-xs font-medium text-white">{next.title}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-violet-400 shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
