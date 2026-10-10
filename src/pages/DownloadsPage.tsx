import { useState, useEffect } from 'react'
import { Download, RefreshCw, Info, AlertCircle, Terminal, ExternalLink } from 'lucide-react'
import { siteConfig } from '../config/site'
import { fetchReleases, type ReleaseFetchResult } from '../services/github'
import type { ReleaseChannel, VersionReleases } from '../types/release'
import VersionSelector from '../components/downloads/VersionSelector'
import ChannelToggle from '../components/downloads/ChannelToggle'
import FeaturedBuild from '../components/downloads/FeaturedBuild'
import BuildList from '../components/downloads/BuildList'
import CodeBlock from '../components/common/CodeBlock'

export default function DownloadsPage() {
  const [selectedVersion, setSelectedVersion] = useState<string>(siteConfig.defaultMinecraftVersion)
  const [channel, setChannel] = useState<ReleaseChannel>('stable')
  const [releasesData, setReleasesData] = useState<ReleaseFetchResult | null>(null)
  const [loading, setLoading] = useState(true)

  const handleRefresh = async () => {
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

  // Filter builds based on channel
  const filteredBuilds = (currentVersionData?.builds || []).filter(
    (b) => b.channel === channel,
  )

  const featuredBuild =
    channel === 'stable'
      ? currentVersionData?.latestStable || filteredBuilds[0]
      : channel === 'beta'
        ? currentVersionData?.latestBeta || filteredBuilds[0]
        : currentVersionData?.latestNightly || filteredBuilds[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold">
          <Download className="w-4 h-4" />
          <span>OFFICIAL ARTIFACTS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Downloads
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Acquire verified, production-ready Veltis server builds. Every build is automatically compiled,
          analyzed, and packaged through our Shulker CI toolchain.
        </p>
      </div>

      {/* GitHub Releases Metadata Source Notification */}
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
              onClick={handleRefresh}
              disabled={loading}
              className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Refresh Releases"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Controls: Version Selector & Channel Toggle */}
      <div className="space-y-4">
        <VersionSelector
          versions={[...siteConfig.supportedMinecraftVersions]}
          selectedVersion={selectedVersion}
          onSelectVersion={setSelectedVersion}
        />

        <ChannelToggle channel={channel} onToggle={setChannel} />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-violet-400 mx-auto" />
          <p className="text-sm font-mono text-slate-400">Loading release catalog...</p>
        </div>
      ) : (
        <>
          {/* Featured Download Card */}
          {featuredBuild ? (
            <FeaturedBuild build={featuredBuild} />
          ) : (
            <div className="p-8 text-center rounded-xl border border-brand-border bg-brand-surface text-slate-400 space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="font-medium text-white text-sm">
                No {channel} builds currently available for Minecraft {selectedVersion}
              </p>
              <p className="text-xs">
                Switch to another channel or select another supported Minecraft version.
              </p>
            </div>
          )}

          {/* Older Builds Archive */}
          <BuildList builds={filteredBuilds} />
        </>
      )}

      {/* Quick Startup Reference */}
      <div className="p-6 rounded-xl border border-brand-border bg-[#0d0f17] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span>Quick Startup Command</span>
        </div>
        <p className="text-xs text-slate-400">
          Launch your Veltis server distribution using Java 25+ / JDK 26:
        </p>
        <CodeBlock
          language="bash"
          code={`java -jar veltis.jar --nogui`}
        />
      </div>
    </div>
  )
}
