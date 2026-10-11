import { useState, useEffect } from 'react'
import { Calendar, GitCommit, ExternalLink, Download, RefreshCw, AlertCircle } from 'lucide-react'
import { siteConfig } from '../config/site'
import { fetchReleases } from '../services/github'
import type { BuildInfo } from '../types/release'
import Badge from '../components/common/Badge'
import ChannelBadge from '../components/common/ChannelBadge'

export default function ChangelogPage() {
  const [builds, setBuilds] = useState<BuildInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReleases().then((res) => {
      const all: BuildInfo[] = []
      Object.values(res.versions).forEach((v) => {
        all.push(...v.builds)
      })
      // Unique by commit (the build identity), newest first.
      const unique = Array.from(new Map(all.map((b) => [b.id, b])).values())
      unique.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      setBuilds(unique)
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="violet">VERSION LOGS</Badge>
          <Badge variant="cyan">RELEASE HISTORY</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Changelog
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          Historical record of feature implementations, architectural optimizations, and security patches
          across all Veltis release channels.
        </p>
      </div>

      {/* 2. Timeline List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-violet-400 mx-auto" />
          <p className="text-sm font-mono text-slate-400">Loading release history...</p>
        </div>
      ) : builds.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
          <p className="text-sm text-slate-400">No releases found.</p>
        </div>
      ) : (
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/5">
        {builds.map((build) => {
          const dateStr = new Date(build.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })

          return (
            <div key={build.id} className="relative pl-10 space-y-3">
              {/* Timeline marker */}
              <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-violet-600 ring-4 ring-[#090a0f] border border-violet-400" />

              <div className="p-6 rounded-xl border border-brand-border bg-brand-surface space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-white font-mono">
                      Veltis {build.minecraftVersion} {build.commitHash}
                    </h3>
                    <ChannelBadge channel={build.channel} />
                    <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      MC {build.minecraftVersion}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <GitCommit className="w-3.5 h-3.5" />
                      <span>{build.commitHash}</span>
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-200">
                  {build.commitMessage}
                </p>

                {build.changes && build.changes.length > 0 && (
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {build.changes.map((c, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-violet-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <a
                    href={build.downloadUrl}
                    className="inline-flex items-center space-x-1.5 text-violet-400 hover:text-violet-300 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Build JAR</span>
                  </a>

                  <a
                    href={build.releaseUrl ?? `${siteConfig.github}/releases`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-300"
                  >
                    <span>View GitHub Release Notes</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
