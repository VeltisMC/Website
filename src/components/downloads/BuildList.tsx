import { useState } from 'react'
import { Download, GitCommit, ChevronDown, ChevronUp } from 'lucide-react'
import type { BuildInfo } from '../../types/release'
import ChannelBadge from '../common/ChannelBadge'

export interface BuildListProps {
  builds: BuildInfo[]
}

export default function BuildList({ builds }: BuildListProps) {
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(10)

  const toggleExpand = (buildId: string) => {
    setExpandedBuild(expandedBuild === buildId ? null : buildId)
  }

  const visibleBuilds = builds.slice(0, displayCount)

  if (builds.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg border border-brand-border bg-brand-surface text-slate-400 font-mono text-sm">
        No builds found for the selected version and channel filter.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold">
          Build Archive ({builds.length} total)
        </h3>
        <span className="text-xs font-mono text-slate-500">Showing latest {visibleBuilds.length}</span>
      </div>

      <div className="rounded-lg border border-brand-border bg-brand-surface divide-y divide-white/5 overflow-hidden">
        {visibleBuilds.map((build) => {
          const isExpanded = expandedBuild === build.id
          const dateStr = new Date(build.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })

          return (
            <div key={build.id} className="transition-colors hover:bg-white/[0.02]">
              {/* Main row */}
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start md:items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-semibold text-slate-300" title={build.artifact}>
                      {build.artifact}
                    </span>
                    <ChannelBadge channel={build.channel} />
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400">
                    <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                    <span>{build.commitHash}</span>
                  </div>

                  <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                    {dateStr}
                  </span>
                </div>

                <div className="flex-1 md:px-4 text-xs text-slate-300 line-clamp-1 font-sans">
                  {build.commitMessage}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleExpand(build.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 text-xs flex items-center space-x-1"
                    aria-label="Inspect build details"
                  >
                    <span>Details</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={build.downloadUrl}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-mono transition-all border border-violet-500/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JAR</span>
                  </a>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 bg-[#0a0d16] border-t border-white/5 space-y-3 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 font-mono block mb-1">Detailed Changes:</span>
                      <ul className="space-y-1 text-slate-300">
                        {build.changes && build.changes.length > 0 ? (
                          build.changes.map((c, i) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <span className="text-violet-400 font-bold">•</span>
                              <span>{c}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-500">{build.commitMessage}</li>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-500 font-mono block mb-1">Artifact:</span>
                        <span className="text-slate-300 font-mono break-all">{build.artifact}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 font-mono block mb-1">Commit:</span>
                        {build.commitUrl ? (
                          <a
                            href={build.commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:underline font-mono break-all"
                          >
                            {build.commitHash}
                          </a>
                        ) : (
                          <span className="text-slate-300 font-mono">{build.commitHash}</span>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-500 font-mono block mb-1">Target JVM:</span>
                        <span className="text-slate-300 font-mono">{build.javaRequirement}</span>
                      </div>

                      {build.releaseUrl && (
                        <div>
                          <a
                            href={build.releaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:underline font-mono"
                          >
                            View GitHub release
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Load More Button */}
      {displayCount < builds.length && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setDisplayCount((prev) => prev + 10)}
            className="px-4 py-2 rounded-md border border-brand-border bg-brand-surface hover:bg-white/5 text-xs font-mono text-slate-300 transition-colors"
          >
            Load Older Builds ({builds.length - displayCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
