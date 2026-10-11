import { useEffect, useId, useRef, useState } from 'react'
import {
  Download,
  ChevronDown,
  FlaskConical,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Calendar,
  GitCommit,
  Info,
} from 'lucide-react'
import type { BuildInfo } from '../../types/release'
import { CHANNELS, canonicalChannel, channelDefinition } from '../../config/channels'
import ChannelBadge from '../common/ChannelBadge'

export interface DownloadHeroProps {
  /** The Minecraft version to headline, taken from verified metadata only. */
  minecraftVersion?: string
  /** The build the primary button downloads, or undefined when none is eligible. */
  primary?: BuildInfo
  /** Every build eligible to be shown, already filtered by the toggle. */
  builds: BuildInfo[]
  /** True when at least one official release build exists. */
  hasRelease: boolean
  /** Whether experimental (non-release) builds are currently revealed. */
  includeExperimental: boolean
  loading: boolean
  error?: string
  onToggleExperimental: () => void
  onSelectBuild: (id: string) => void
  onRetry: () => void
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * The Downloads hero: a prominent primary download with a build-picker dropdown
 * and a separate experimental-builds toggle. It never presents a non-release
 * build as stable: when no release exists the primary action is disabled and the
 * visitor is told plainly, with the experimental builds offered only once they
 * opt in.
 */
export default function DownloadHero({
  minecraftVersion,
  primary,
  builds,
  hasRelease,
  includeExperimental,
  loading,
  error,
  onToggleExperimental,
  onSelectBuild,
  onRetry,
}: DownloadHeroProps) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Group eligible builds by their canonical channel so the dropdown mirrors the
  // published taxonomy instead of one flat list. `stable` is an alias of
  // `release`, so its canonical is de-duplicated here; the first (non-legacy)
  // definition for a canonical supplies the group's label and colour.
  const groupDefinitions = CHANNELS.reduce<typeof CHANNELS[number][]>((acc, definition) => {
    if (!acc.some((entry) => entry.canonical === definition.canonical)) acc.push(definition)
    return acc
  }, [])
  const groups = groupDefinitions
    .map((definition) => ({
      definition,
      builds: builds.filter((b) => canonicalChannel(b.channel) === definition.canonical),
    }))
    .filter((group) => group.builds.length > 0)

  const primaryChannel = primary ? channelDefinition(primary.channel) : undefined

  return (
    <section className="rounded-2xl border border-brand-border bg-gradient-to-b from-[#111422] to-brand-surface p-6 sm:p-10 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:items-center">
        <div className="space-y-5">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold">
            <Download className="w-4 h-4" />
            <span>Downloads</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            {loading ? 'Get Veltis' : minecraftVersion ? `Get Veltis ${minecraftVersion}` : 'Get Veltis'}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Veltis is Minecraft server software. It works directly with Minecraft&apos;s own
            server code and adds its own runtime, packaged here as a single distributable jar.
          </p>

          {primary ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-slate-400">
              <ChannelBadge channel={primary.channel} />
              <span className="flex items-center space-x-1.5">
                <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                <span>{primary.commitHash}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Published {formatDate(primary.publishedAt)}</span>
              </span>
              <span className="text-slate-500">{primary.javaRequirement}</span>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 shrink-0 lg:items-end w-full lg:w-auto">
          {error ? (
            <div className="w-full sm:w-96 p-4 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-200 text-xs font-mono space-y-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded border border-amber-500/40 hover:bg-amber-500/10"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : loading ? (
            <div className="w-full sm:w-96 h-12 rounded-lg border border-brand-border bg-[#0d0f17] flex items-center justify-center space-x-2 text-xs font-mono text-slate-400">
              <RefreshCw className="w-4 h-4 animate-spin text-violet-400" />
              <span>Loading builds...</span>
            </div>
          ) : (
            <>
              <div ref={containerRef} className="relative w-full sm:w-96">
                <div className="flex">
                  {primary ? (
                    <a
                      href={primary.downloadUrl}
                      className="flex-1 flex items-center justify-center space-x-2 px-5 py-3.5 rounded-l-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm shadow-lg shadow-violet-600/25 active:scale-[0.99] transition-all"
                      aria-label={`Download ${primary.artifact}`}
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span className="truncate" title={primary.artifact}>
                        Download {primary.minecraftVersion}
                      </span>
                      {primaryChannel ? (
                        <span className="text-xs opacity-80 font-mono">{primaryChannel.shortLabel}</span>
                      ) : null}
                    </a>
                  ) : (
                    <span
                      className="flex-1 flex items-center justify-center space-x-2 px-5 py-3.5 rounded-l-lg bg-slate-800 text-slate-500 font-medium text-sm cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>No builds available</span>
                    </span>
                  )}

                  <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    aria-controls={menuId}
                    disabled={builds.length === 0}
                    className="px-3 rounded-r-lg bg-violet-600 hover:bg-violet-500 text-white border-l border-violet-500/60 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                    aria-label="Choose a different build"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {open && (
                  <div
                    id={menuId}
                    role="menu"
                    aria-label="Available builds"
                    className="absolute right-0 mt-2 w-full sm:w-[26rem] max-h-96 overflow-y-auto rounded-lg border border-brand-border bg-[#0d0f17] shadow-2xl z-30 divide-y divide-white/5"
                  >
                    {groups.map((group) => (
                      <div key={group.definition.id} className="p-2">
                        <div className="px-2 py-1">
                          <ChannelBadge channel={group.definition.id} />
                        </div>
                        {group.builds.map((build) => (
                          <div
                            key={build.id}
                            className={`flex items-center justify-between gap-3 px-2 py-2 rounded hover:bg-white/5 ${
                              primary?.id === build.id ? 'bg-violet-600/10' : ''
                            }`}
                          >
                            <button
                              type="button"
                              role="menuitemradio"
                              aria-checked={primary?.id === build.id}
                              aria-label={`${channelDefinition(build.channel)?.label ?? build.channel} build ${build.minecraftVersion} ${build.commitHash}`}
                              onClick={() => {
                                onSelectBuild(build.id)
                                setOpen(false)
                              }}
                              className="flex-1 text-left min-w-0"
                            >
                              <div className="text-sm text-white font-mono truncate" title={build.artifact}>
                                Veltis {build.minecraftVersion} {build.commitHash}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {formatDate(build.publishedAt)} &bull; {build.javaRequirement}
                              </div>
                            </button>
                            <div className="flex items-center space-x-2 shrink-0">
                              {build.releaseUrl && (
                                <a
                                  href={build.releaseUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5"
                                  aria-label={`Release notes for ${build.artifact}`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <a
                                href={build.downloadUrl}
                                className="p-1.5 rounded text-violet-300 hover:text-white hover:bg-violet-600/30"
                                aria-label={`Download ${build.artifact}`}
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Secondary outlined experimental toggle */}
              <button
                type="button"
                onClick={onToggleExperimental}
                aria-pressed={includeExperimental}
                className={`w-full sm:w-96 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border text-xs font-mono transition-colors ${
                  includeExperimental
                    ? 'border-amber-500/40 bg-amber-950/20 text-amber-200'
                    : 'border-brand-border bg-brand-surface text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>{includeExperimental ? 'Hide experimental builds' : 'Show experimental builds'}</span>
              </button>

              {!hasRelease && (
                <p className="w-full sm:w-96 flex items-start space-x-2 text-[11px] font-mono text-amber-300/90">
                  <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    No official release build is available yet. Only experimental channels have
                    published builds; they are not stable.
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
