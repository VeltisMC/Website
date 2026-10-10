import { Link } from 'react-router-dom'
import { Home, Download, BookOpen, Users } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="inline-block p-3 rounded-full bg-violet-500/10 text-violet-400 font-mono text-xl font-bold border border-violet-500/20">
        404
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Page Not Found
      </h1>

      <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
        The destination you requested does not exist or has been moved in a recent restructuring.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-xs font-mono">
        <Link
          to="/"
          className="p-3 rounded-lg border border-brand-border bg-brand-surface hover:bg-white/5 text-slate-300 flex flex-col items-center space-y-2 transition-colors"
        >
          <Home className="w-4 h-4 text-violet-400" />
          <span>Home</span>
        </Link>

        <Link
          to="/downloads"
          className="p-3 rounded-lg border border-brand-border bg-brand-surface hover:bg-white/5 text-slate-300 flex flex-col items-center space-y-2 transition-colors"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>Downloads</span>
        </Link>

        <Link
          to="/docs"
          className="p-3 rounded-lg border border-brand-border bg-brand-surface hover:bg-white/5 text-slate-300 flex flex-col items-center space-y-2 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Docs</span>
        </Link>

        <Link
          to="/community"
          className="p-3 rounded-lg border border-brand-border bg-brand-surface hover:bg-white/5 text-slate-300 flex flex-col items-center space-y-2 transition-colors"
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Community</span>
        </Link>
      </div>
    </div>
  )
}
