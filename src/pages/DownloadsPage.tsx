import { useState, useEffect } from 'react'
import { RefreshCw, Info, Terminal, ExternalLink } from 'lucide-react'
import { siteConfig } from '../config/site'
import { fetchReleases, type ReleaseFetchResult } from '../services/github'
import type { BuildInfo, VersionReleases } from '../types/release'
import { eligibleBuilds, hasOfficialRelease } from '../services/downloadSelection'
import VersionSelector from '../components/downloads/VersionSelector'
import DownloadHero from '../components/downloads/DownloadHero'
import BuildList from '../components/downloads/BuildList'
import CodeBlock from '../components/common/CodeBlock'

export default function DownloadsPage() {
  const [selectedVersion, setSelectedVersion] = useState<string>(siteConfig.defaultMinecraftVersion)
  const [includeExperimental, setIncludeExperimental] = useState(false)
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null)
  const [releasesData, setReleasesData] = useState<ReleaseFetchResult | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const result = await fetchReleases()
    setReleasesData(result)
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    fetchReleases().then((result) => {
      if (active) {
        setReleasesData(result)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const currentVersionData: VersionReleases | undefined = releasesData?.versions[selectedVersion]
  const allBuilds: BuildInfo[] = currentVersionData?.builds ?? []
  const eligible = eligibleBuilds(allBuilds, includeExperimental)
  const hasRelease = hasOfficialRelease(allBuilds)

  // The user's explicit pick wins only while it is still eligible; otherwise the
  // newest eligible build is used. This is what keeps the button and the list
  // from ever disagreeing, and it never promotes an experimental build to the
  // primary action while experimental builds are hidden.
  const primary =
    eligible.find((b) => b.id === selectedBuildId) ?? eligible[0]

  const unavailableError =
    !loading && releasesData && allBuilds.length === 0
      ? 'No published builds were found for this version. Nothing is shown to avoid offering a download that does not exist.'
      : undefined

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <DownloadHero
        minecraftVersion={primary?.minecraftVersion ?? (allBuilds.length > 0 ? selectedVersion : undefined)}
        primary={primary}
        builds={eligible}
        hasRelease={hasRelease}
        includeExperimental={includeExperimental}
        loading={loading}
        error={unavailableError}
        onToggleExperimental={() => setIncludeExperimental((v) => !v)}
        onSelectBuild={setSelectedBuildId}
        onRetry={load}
      />

      {/* Metadata source + refresh */}
      {releasesData && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg border border-brand-border bg-brand-surface text-xs font-mono text-slate-400 gap-3">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-violet-400 shrink-0" />
            <span>{releasesData.sourceNote}</span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href={`https://github.com/${siteConfig.githubRepo}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-violet-400 hover:underline"
            >
              <span>GitHub Releases</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Refresh Releases"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Version selector, only meaningful when more than one is supported */}
      {siteConfig.supportedMinecraftVersions.length > 1 && (
        <VersionSelector
          versions={[...siteConfig.supportedMinecraftVersions]}
          selectedVersion={selectedVersion}
          onSelectVersion={(v) => {
            setSelectedVersion(v)
            setSelectedBuildId(null)
          }}
        />
      )}

      {!loading && (
        <>
          {/* Archive for the currently selected channel set */}
          <BuildList builds={eligible} />
        </>
      )}

      {/* Quick Startup Reference */}
      <div className="p-6 rounded-xl border border-brand-border bg-[#0d0f17] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span>Quick Startup Command</span>
        </div>
        <p className="text-xs text-slate-400">
          Launch the build you downloaded. Use the filename shown on the download button:
        </p>
        <CodeBlock
          language="bash"
          code={`java -jar "${primary?.artifact ?? 'veltis.jar'}" --nogui`}
        />
      </div>
    </div>
  )
}
