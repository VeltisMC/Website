import { Hammer, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import Badge from '../components/common/Badge'
import DiscordIcon from '../components/common/DiscordIcon'
import GithubIcon from '../components/common/GithubIcon'

export default function DevelopersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header Banner */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="amber">WORK IN PROGRESS</Badge>
          <Badge variant="violet">VELTIS API</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Developer Portal
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          The official documentation and development tooling for the Veltis Native API is currently under construction.
        </p>
      </div>

      {/* Under Construction Hero Card */}
      <div className="p-8 sm:p-12 rounded-2xl border border-brand-border bg-gradient-to-b from-[#111422] to-brand-surface text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <Hammer className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-white">
            API In Active Development
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We are actively architecting the Veltis native runtime and world simulation engine.
            To ensure extensions are built on a solid foundation, public API contracts, lifecycle interfaces,
            and build tool plugins will be released once the core runtime stabilizes.
          </p>
        </div>

        {/* Development Priorities */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
          <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-violet-400 font-bold block">CURRENT FOCUS</span>
            <h4 className="text-xs font-semibold text-white">World Simulation</h4>
            <p className="text-[11px] text-slate-400">Region ownership and multithreaded simulation engine.</p>
          </div>
          <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-amber-400 font-bold block">IN QUEUE</span>
            <h4 className="text-xs font-semibold text-white">Runtime Stabilization</h4>
            <p className="text-[11px] text-slate-400">Minecraft 26.3 decompile integration and Java 25+ base.</p>
          </div>
          <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-sky-400 font-bold block">NEXT PHASE</span>
            <h4 className="text-xs font-semibold text-white">Public API RFC</h4>
            <p className="text-[11px] text-slate-400">Capability-oriented extension interface specifications.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={siteConfig.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-medium transition-colors shadow-lg shadow-[#5865F2]/20"
          >
            <DiscordIcon className="w-4 h-4" />
            <span>Join Discord for API Updates</span>
          </a>

          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border border-brand-border bg-brand-surface hover:bg-white/5 text-slate-200 text-sm font-medium transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Follow GitHub Repository</span>
          </a>
        </div>
      </div>

      {/* Contributor notice */}
      <div className="p-6 rounded-xl border border-brand-border bg-[#0d0f17] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-semibold text-white flex items-center justify-center sm:justify-start space-x-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Interested in contributing to the server engine?</span>
          </h3>
          <p className="text-xs text-slate-400">
            Check our development setup, requirements (JDK 26), and build guidelines.
          </p>
        </div>

        <Link
          to="/contributing"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 text-xs font-mono transition-all shrink-0"
        >
          <span>Contribution Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
