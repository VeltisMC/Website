/**
 * The release channels Veltis publishes. These are the exact names the build's
 * `channel` value can take (`gradle.properties`, overridable with `-Pchannel`),
 * and the names the server repository sends in its release metadata. They are
 * never inferred from a commit or a branch.
 */
export type ReleaseChannel = 'stable' | 'beta' | 'nightly'

export interface BuildInfo {
  /** Unique per build. The source revision identifies it, so it is stable. */
  id: string
  /** The Veltis software version, e.g. `1.0.0-SNAPSHOT`. */
  version: string
  minecraftVersion: string
  channel: ReleaseChannel
  publishedAt: string
  /** Full 40-character commit SHA when published by CI; otherwise the short id. */
  commit: string
  /** The short (7-character) commit id shown in the UI. */
  commitHash: string
  commitUrl?: string
  commitMessage: string
  downloadUrl: string
  /**
   * The published filename, e.g. `Veltis 26.3 stable a1b2c3d.jar`. This is the
   * human name the release is titled with.
   */
  artifact: string
  releaseUrl?: string
  sha256?: string
  /** Size in bytes, when the publisher reported it. */
  size?: number
  javaRequirement: string
  changes: string[]
  isPrerelease: boolean
}

export interface VersionReleases {
  minecraftVersion: string
  latestStable?: BuildInfo
  latestBeta?: BuildInfo
  latestNightly?: BuildInfo
  builds: BuildInfo[]
}

export interface GitHubReleaseAsset {
  id: number
  name: string
  browser_download_url: string
  size: number
  created_at: string
}

export interface GitHubRelease {
  id: number
  tag_name: string
  name: string
  body: string
  prerelease: boolean
  draft: boolean
  published_at: string
  html_url: string
  assets: GitHubReleaseAsset[]
}

/**
 * One build's publication metadata, exactly as the Veltis repository's CI
 * dispatches it and as this site stores it at `/releases/<channel>.json`.
 *
 * `artifact` is the GitHub download filename; `distributionArtifact` is the
 * constant local name (`veltis.jar`) the build produced before CI renamed it.
 * Both are kept because they are different facts about the same build.
 */
export interface ChannelRelease {
  channel: ReleaseChannel
  version: string
  minecraftVersion: string
  commit: string
  shortCommit: string
  artifact: string
  /**
   * The filename a GitHub release stores the asset under: the same values as
   * `artifact`, but GitHub has already replaced the spaces with dots. That is
   * the string the release's own asset list holds and the download is served
   * as, so the UI prefers it when it is present.
   */
  assetName?: string
  distributionArtifact: string
  downloadUrl: string
  releaseUrl?: string
  publishedAt: string
  size?: number
  minimumJavaVersion?: number
}

/**
 * The file at `/releases/<channel>.json`: the channel's latest build plus its
 * history, newest first. Written by the sync workflow, never by hand.
 */
export interface ChannelReleaseFile {
  channel: ReleaseChannel
  latest: ChannelRelease
  history?: ChannelRelease[]
}
