import { useState } from 'react'
import { Download, Copy, Check, Calendar, GitCommit, ShieldCheck, FileText } from 'lucide-react'
import type { BuildInfo } from '../../types/release'
import Badge from '../common/Badge'

export interface FeaturedBuildProps {
  build: BuildInfo
}

export default function FeaturedBuild({ build }: FeaturedBuildProps) {
  const [copiedSha, setCopiedSha] = useState(false)

  const handleCopySha = async () => {
    if (!build.sha256) return
    try {
      await navigator.clipboard.writeText(build.sha256)
      setCopiedSha(true)
      setTimeout(() => setCopiedSha(false), 2000)
    } catch {
      // fallback
    }
  }

  const formattedDate = new Date(build.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="rounded-xl border border-brand-border bg-gradient-to-b from-[#111422] to-brand-surface p-6 shadow-xl relative overflow-hidden">
      {/* Background visual highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Information */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
              Veltis {build.minecraftVersion}
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-violet-400 font-mono">
              {build.commitHash}
            </span>

            <Badge
              variant={
                build.channel === 'stable'
                  ? 'emerald'
                  : build.channel === 'beta'
                    ? 'cyan'
                    : 'amber'
              }
            >
              {build.channel.toUpperCase()}
            </Badge>

            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
              {build.javaRequirement}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Released {formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <GitCommit className="w-3.5 h-3.5 text-slate-500" />
              {build.commitUrl ? (
                <a
                  href={build.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:underline"
                >
                  {build.commitHash}
                </a>
              ) : (
                <span>{build.commitHash}</span>
              )}
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Artifact</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-xl font-medium">
            {build.commitMessage}
          </p>

          {/* Changelog highlights */}
          {build.changes && build.changes.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Recent Build Changes:
              </span>
              <ul className="space-y-1 text-xs text-slate-400">
                {build.changes.map((change, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-violet-400">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right CTA Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <a
            href={build.downloadUrl}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all shadow-lg shadow-violet-600/25 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="truncate max-w-[16rem] sm:max-w-xs" title={build.artifact}>
              Download {build.artifact}
            </span>
          </a>

          {build.sha256 && (
            <button
              type="button"
              onClick={handleCopySha}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-brand-border bg-[#0a0d15] hover:bg-white/5 text-slate-300 text-xs font-mono transition-colors"
            >
              {copiedSha ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">SHA-256 Checksum Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy SHA-256 Checksum</span>
                </>
              )}
            </button>
          )}

          <a
            href="/changelog"
            className="flex items-center justify-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors pt-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View full changelog history</span>
          </a>
        </div>
      </div>
    </div>
  )
}
