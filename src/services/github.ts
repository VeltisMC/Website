import type {
  BuildInfo,
  ChannelRelease,
  ChannelReleaseFile,
  GitHubRelease,
  ReleaseChannel,
  VersionReleases,
} from '../types/release'
import { siteConfig } from '../config/site'
import { RELEASE_CHANNEL_IDS, isReleaseChannel } from '../config/channels'
import { githubAssetName } from './releaseValidation'

const CHANNELS: readonly ReleaseChannel[] = RELEASE_CHANNEL_IDS

/**
 * The published filename, parsed so a GitHub-release-only fallback can recover
 * the same facts the metadata file carries. Two spellings exist for one name:
 * the human `Veltis 26.3 nightly aaa8824.jar`, and the form GitHub stores,
 * `Veltis.26.3.nightly.aaa8824.jar` — GitHub normalizes every release asset
 * name, so the releases API only ever returns the dotted one.
 */
const ARTIFACT_PATTERN =
  /^Veltis[ .](.+?)[ .](pre-alpha|alpha|beta|release|nightly|stable)[ .]([0-9a-f]{7})\.jar$/

/** The release tag CI writes: `veltis-<channel>-<minecraft>-<sha>`. */
const TAG_PATTERN = /^veltis-(pre-alpha|alpha|beta|release|nightly|stable)-(.+)-([0-9a-f]{7})$/

export interface ReleaseFetchResult {
  versions: Record<string, VersionReleases>
  isLiveGitHubData: boolean
  sourceNote: string
}

function commitUrl(commit: string): string {
  return `https://github.com/${siteConfig.githubRepo}/commit/${commit}`
}

/** Turns one channel-metadata entry into the shape the download UI renders. */
function fromChannelRelease(release: ChannelRelease): BuildInfo {
  const short = release.shortCommit || release.commit.slice(0, 7)
  // The release stores the asset under `assetName` (GitHub folds the spaces of
  // `artifact` into dots); that is the file the download URL serves, so it is
  // the filename the UI shows. Older payloads without it fall back to `artifact`.
  const artifact =
    release.assetName && release.assetName.length > 0 ? release.assetName : release.artifact
  return {
    id: release.commit || release.artifact,
    version: release.version,
    minecraftVersion: release.minecraftVersion,
    channel: release.channel,
    publishedAt: release.publishedAt,
    commit: release.commit,
    commitHash: short,
    commitUrl: release.commit ? commitUrl(release.commit) : release.releaseUrl,
    commitMessage: `Veltis ${release.minecraftVersion} ${release.channel} build`,
    downloadUrl: release.downloadUrl,
    artifact,
    releaseUrl: release.releaseUrl,
    size: release.size,
    javaRequirement:
      typeof release.minimumJavaVersion === 'number'
        ? `Java ${release.minimumJavaVersion}+`
        : siteConfig.javaRequirement,
    changes: [],
    isPrerelease: CHANNEL_PRERELEASE(release.channel),
  }
}

function CHANNEL_PRERELEASE(channel: ReleaseChannel): boolean {
  // Kept local so the service does not depend on the presentation module at
  // runtime; the canonical answer lives in config/channels.
  return channel !== 'release' && channel !== 'stable'
}

/**
 * Validates one channel metadata file before any of it is trusted. The website
 * workflow validates the payload on arrival; this validates it again at read
 * time, because a hand-edited or corrupted file must fall back rather than
 * render a download button pointing somewhere wrong.
 */
function isValidChannelRelease(value: unknown): value is ChannelRelease {
  if (typeof value !== 'object' || value === null) return false
  const r = value as Record<string, unknown>
  if (
    !(
      isReleaseChannel(r.channel) &&
      typeof r.version === 'string' && r.version.length > 0 &&
      typeof r.minecraftVersion === 'string' && r.minecraftVersion.length > 0 &&
      typeof r.commit === 'string' && /^[0-9a-f]{40}$/.test(r.commit) &&
      typeof r.shortCommit === 'string' && r.shortCommit === r.commit.slice(0, 7) &&
      typeof r.artifact === 'string' && r.artifact.length > 0 &&
      r.distributionArtifact === 'veltis.jar' &&
      typeof r.downloadUrl === 'string' && /^https:\/\//.test(r.downloadUrl) &&
      typeof r.publishedAt === 'string' && r.publishedAt.length > 0
    )
  ) {
    return false
  }
  // The stored entry may carry assetName; when it does it must be the GitHub
  // form of `artifact`. This keeps a hand-edited file from mixing the two.
  if (r.assetName !== undefined) {
    if (typeof r.assetName !== 'string' || r.assetName.length === 0) return false
    if (r.assetName !== githubAssetName(r.artifact)) return false
  }
  return true
}

async function fetchChannelFile(channel: ReleaseChannel): Promise<ChannelReleaseFile | null> {
  try {
    const res = await fetch(`${siteConfig.releasesBasePath}/${channel}.json`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const body: unknown = await res.json()
    if (typeof body !== 'object' || body === null) return null
    const file = body as Record<string, unknown>
    if (file.channel !== channel) return null
    if (!isValidChannelRelease(file.latest)) return null
    const history = Array.isArray(file.history)
      ? file.history.filter(isValidChannelRelease)
      : []
    return { channel, latest: file.latest, history }
  } catch {
    return null
  }
}

/**
 * The authoritative source: the per-channel metadata the sync workflow commits
 * after a successful build. Returns null when no channel has published yet.
 */
async function fetchPublishedReleases(): Promise<BuildInfo[] | null> {
  const files = await Promise.all(CHANNELS.map(fetchChannelFile))
  const published = files.filter((f): f is ChannelReleaseFile => f !== null)
  if (published.length === 0) return null

  const builds: BuildInfo[] = []
  const seen = new Set<string>()
  for (const file of published) {
    for (const entry of [file.latest, ...(file.history ?? [])]) {
      const key = entry.commit || entry.artifact
      if (seen.has(key)) continue
      seen.add(key)
      builds.push(fromChannelRelease({ ...entry, channel: file.channel }))
    }
  }
  return builds
}

/** Recovers a build from a GitHub Release when no metadata file exists yet. */
function parseGitHubRelease(release: GitHubRelease): BuildInfo | null {
  const tag = release.tag_name || ''
  const jar = release.assets?.find((a) => a.name.endsWith('.jar'))
  const fromAsset = jar ? ARTIFACT_PATTERN.exec(jar.name) : null
  const fromTag = TAG_PATTERN.exec(tag)

  const channel = fromAsset?.[2] ?? fromTag?.[1] ?? (release.prerelease ? 'nightly' : 'stable')
  if (!isReleaseChannel(channel)) return null

  const minecraftVersion = fromAsset?.[1] ?? fromTag?.[2] ?? siteConfig.defaultMinecraftVersion
  const short = fromAsset?.[3] ?? fromTag?.[3] ?? ''
  const artifact = jar?.name ?? release.name ?? tag

  return {
    id: tag || String(release.id),
    version: release.name || tag || artifact,
    minecraftVersion,
    channel,
    publishedAt: release.published_at,
    // The releases API does not carry the full SHA unless it is in the tag or
    // asset name, so the short id is the honest value here.
    commit: short,
    commitHash: short || 'HEAD',
    commitUrl: release.html_url,
    commitMessage: release.name || tag,
    downloadUrl: jar ? jar.browser_download_url : release.html_url,
    artifact,
    releaseUrl: release.html_url,
    size: jar?.size,
    javaRequirement: siteConfig.javaRequirement,
    changes: release.body
      ? release.body
          .split('\n')
          .map((line) => line.trim().replace(/^[-*]\s*/, ''))
          .filter((line) => line.length > 0 && !line.startsWith('#'))
          .slice(0, 5)
      : [],
    isPrerelease: release.prerelease,
  }
}

async function fetchFromGitHub(): Promise<ReleaseFetchResult> {
  try {
    const res = await fetch(`https://api.github.com/repos/${siteConfig.githubRepo}/releases`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) {
      return {
        versions: groupBuildsByVersion([]),
        isLiveGitHubData: false,
        sourceNote: `GitHub API returned ${res.status} (${res.statusText}). No published release metadata yet.`,
      }
    }

    const releases: GitHubRelease[] = await res.json()
    const builds = Array.isArray(releases)
      ? releases
          .map(parseGitHubRelease)
          .filter((b): b is BuildInfo => b !== null)
      : []

    if (builds.length === 0) {
      return {
        versions: groupBuildsByVersion([]),
        isLiveGitHubData: false,
        sourceNote: 'No releases found yet. Published builds will appear here.',
      }
    }

    return {
      versions: groupBuildsByVersion(builds),
      isLiveGitHubData: true,
      sourceNote: 'Showing releases published on GitHub.',
    }
  } catch {
    return {
      versions: groupBuildsByVersion([]),
      isLiveGitHubData: false,
      sourceNote: 'Could not reach GitHub. No published release metadata is available.',
    }
  }
}

/**
 * Resolves the release catalog, preferring the authoritative per-channel
 * metadata (written by this repository's sync workflow) over live GitHub
 * Releases, and falling back to an empty — never fabricated — catalog.
 */
export async function fetchReleases(): Promise<ReleaseFetchResult> {
  const published = await fetchPublishedReleases()
  if (published) {
    return {
      versions: groupBuildsByVersion(published),
      isLiveGitHubData: false,
      sourceNote: 'Showing published Veltis release metadata.',
    }
  }
  return fetchFromGitHub()
}

function groupBuildsByVersion(builds: BuildInfo[]): Record<string, VersionReleases> {
  const versions: Record<string, VersionReleases> = {}

  const ensure = (minecraftVersion: string): VersionReleases => {
    let entry = versions[minecraftVersion]
    if (!entry) {
      entry = { minecraftVersion, builds: [] }
      versions[minecraftVersion] = entry
    }
    return entry
  }

  for (const version of siteConfig.supportedMinecraftVersions) {
    ensure(version)
  }

  for (const build of builds) {
    ensure(build.minecraftVersion).builds.push(build)
  }

  for (const entry of Object.values(versions)) {
    // Most recent first; the publication time is the only ordering we can trust.
    entry.builds.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    entry.latestStable = entry.builds.find((b) => b.channel === 'release' || b.channel === 'stable')
    entry.latestBeta = entry.builds.find((b) => b.channel === 'beta')
    entry.latestNightly = entry.builds.find((b) => b.channel === 'nightly')
  }

  return versions
}
