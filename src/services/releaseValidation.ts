/**
 * Release payload validation.
 *
 * <p>The build repository (`VeltisMC/Veltis`) publishes a build, uploads the
 * asset to a GitHub Release, and dispatches a `veltis-release` repository event
 * whose `client_payload` carries the build facts under `metadata` and the
 * durable location under `release`. The website's `sync-release.yml` workflow
 * validates that payload with `jq` before writing channel metadata, and this
 * module is the same rules expressed once in TypeScript so the rules can be
 * unit-tested, reused as a defensive read-time check, and kept in sync with the
 * workflow by a test that reads the workflow file.
 *
 * <p>Nothing here trusts the caller. A payload that fails returns a list of
 * `field: expected X, received Y` issues and is never partially accepted.
 */
import { isReleaseChannel, type ReleaseChannel } from '../config/channels'

/** The build facts half of the dispatch payload. */
export interface ReleasePayloadMetadata {
  channel?: unknown
  version?: unknown
  minecraftVersion?: unknown
  commit?: unknown
  shortCommit?: unknown
  artifact?: unknown
  assetName?: unknown
  distributionArtifact?: unknown
  minimumJavaVersion?: unknown
}

/** The durable location half of the dispatch payload. */
export interface ReleasePayloadLocation {
  downloadUrl?: unknown
  releaseUrl?: unknown
  publishedAt?: unknown
  size?: unknown
}

/** The wire shape of `client_payload` for a `veltis-release` dispatch. */
export interface ReleasePayload {
  metadata?: ReleasePayloadMetadata
  release?: ReleasePayloadLocation
}

/** The flat entry stored in `public/releases/<channel>.json`. */
export interface NormalizedRelease {
  channel: ReleaseChannel
  version: string
  minecraftVersion: string
  commit: string
  shortCommit: string
  artifact: string
  assetName: string
  distributionArtifact: string
  minimumJavaVersion?: number
  downloadUrl: string
  releaseUrl: string
  publishedAt: string
  size?: number
}

export interface ValidationIssue {
  field: string
  message: string
  expected?: string
  received?: string
}

export type ReleaseValidationResult =
  | { ok: true; value: NormalizedRelease }
  | { ok: false; issues: ValidationIssue[] }

export interface ReleaseValidatorConfig {
  /** `owner/name` the release must live in. */
  repository: string
  /** Predicate for accepted channel identifiers. */
  isChannel?: (value: unknown) => value is ReleaseChannel
}

const FULL_SHA = /^[0-9a-f]{40}$/
const SHORT_SHA = /^[0-9a-f]{7}$/
const ASSET_NAME = /^[A-Za-z0-9_+@.-]+$/

/**
 * The name GitHub stores an uploaded asset under. GitHub replaces every run of
 * characters outside `[A-Za-z0-9_+@-]` with a dot, collapses runs of dots and
 * trims leading/trailing dots. This mirrors the Gradle build's
 * `githubAssetName` exactly; the spaced `artifact` is the release title, this is
 * the file that is actually stored and downloaded.
 */
export function githubAssetName(releaseName: string): string {
  const normalized = releaseName
    .replace(/[^A-Za-z0-9_+@-]+/g, '.')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+|\.+$/g, '')
  return normalized.length > 0 ? normalized : 'veltis.jar'
}

/** The canonical release title: `Veltis <MinecraftVersion> <Channel> <sha7>.jar`. */
export function releaseArtifactName(
  minecraftVersion: string,
  channel: string,
  shortCommit: string,
): string {
  return `Veltis ${minecraftVersion} ${channel} ${shortCommit}.jar`
}

/** The release tag CI writes: `veltis-<channel>-<minecraft>-<sha7>`. */
export function releaseTag(
  channel: string,
  minecraftVersion: string,
  shortCommit: string,
): string {
  return `veltis-${channel}-${minecraftVersion}-${shortCommit}`
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

/**
 * Validates a dispatch payload. On success returns the flat entry to store; on
 * failure returns every issue found, each naming the failing field with the
 * expected and received values.
 */
export function validateReleasePayload(
  payload: unknown,
  config: ReleaseValidatorConfig,
): ReleaseValidationResult {
  const issues: ValidationIssue[] = []
  const accept = config.isChannel ?? isReleaseChannel

  const fail = (field: string, message: string, expected?: string, received?: string) => {
    issues.push({ field, message, expected, received })
  }
  const expectString = (field: string, value: unknown): string | undefined => {
    const s = asString(value)
    if (s === undefined || s.length === 0) {
      fail(field, 'must be a non-empty string', 'non-empty string', String(value))
      return undefined
    }
    return s
  }

  if (typeof payload !== 'object' || payload === null) {
    return {
      ok: false,
      issues: [{ field: '$', message: 'payload is not an object', expected: 'object', received: typeof payload }],
    }
  }

  const { metadata, release } = payload as ReleasePayload
  if (typeof metadata !== 'object' || metadata === null) {
    return {
      ok: false,
      issues: [{ field: 'metadata', message: 'missing or not an object', received: String(metadata) }],
    }
  }
  if (typeof release !== 'object' || release === null) {
    return {
      ok: false,
      issues: [{ field: 'release', message: 'missing or not an object', received: String(release) }],
    }
  }

  // 2. Channel must be explicitly supported.
  const channelRaw = metadata.channel
  if (!accept(channelRaw)) {
    fail('metadata.channel', 'is not a supported channel', 'pre-alpha|alpha|beta|release|nightly|stable', String(channelRaw))
    return { ok: false, issues }
  }
  const channel = channelRaw

  // 4. Required metadata.
  const version = expectString('metadata.version', metadata.version)
  const minecraftVersion = expectString('metadata.minecraftVersion', metadata.minecraftVersion)
  const distributionArtifact = expectString('metadata.distributionArtifact', metadata.distributionArtifact)

  // 3. Commit and short commit.
  const commit = expectString('metadata.commit', metadata.commit)
  if (commit && !FULL_SHA.test(commit)) {
    fail('metadata.commit', 'is not a full 40-character lowercase SHA', '^[0-9a-f]{40}$', commit)
  }
  const shortCommit = expectString('metadata.shortCommit', metadata.shortCommit)
  if (shortCommit && !SHORT_SHA.test(shortCommit)) {
    fail('metadata.shortCommit', 'is not a 7-character lowercase SHA', '^[0-9a-f]{7}$', shortCommit)
  }
  if (commit && shortCommit && FULL_SHA.test(commit) && SHORT_SHA.test(shortCommit) && shortCommit !== commit.slice(0, 7)) {
    fail('metadata.shortCommit', 'does not match the first 7 characters of metadata.commit', commit.slice(0, 7), shortCommit)
  }

  // 5/6. Canonical asset filename.
  const artifact = expectString('metadata.artifact', metadata.artifact)
  const assetName = expectString('metadata.assetName', metadata.assetName)
  if (
    artifact &&
    minecraftVersion &&
    shortCommit &&
    SHORT_SHA.test(shortCommit) &&
    artifact !== releaseArtifactName(minecraftVersion, channel, shortCommit)
  ) {
    fail(
      'metadata.artifact',
      'does not follow the canonical release filename',
      releaseArtifactName(minecraftVersion, channel, shortCommit),
      artifact,
    )
  }
  if (assetName && !ASSET_NAME.test(assetName)) {
    fail('metadata.assetName', 'contains characters no GitHub asset may hold', '^[A-Za-z0-9_+@.-]+$', assetName)
  }
  if (artifact && assetName && assetName !== githubAssetName(artifact)) {
    fail('metadata.assetName', 'is not the GitHub-stored form of metadata.artifact', githubAssetName(artifact), assetName)
  }
  if (artifact && distributionArtifact !== undefined && distributionArtifact !== 'veltis.jar') {
    fail('metadata.distributionArtifact', 'must be the constant local name', 'veltis.jar', distributionArtifact)
  }

  // 11. Minimum Java version, when present, must be a real feature release.
  let minimumJavaVersion: number | undefined
  if (metadata.minimumJavaVersion !== undefined && metadata.minimumJavaVersion !== null) {
    const n = metadata.minimumJavaVersion
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 8 || n > 99) {
      fail('metadata.minimumJavaVersion', 'is not a plausible Java feature release', 'integer 8..99', String(n))
    } else {
      minimumJavaVersion = n
    }
  }

  // 7/8/9/10. Location.
  const downloadUrl = expectString('release.downloadUrl', release.downloadUrl)
  const releaseUrl = expectString('release.releaseUrl', release.releaseUrl)
  const publishedAt = expectString('release.publishedAt', release.publishedAt)

  if (publishedAt && Number.isNaN(Date.parse(publishedAt))) {
    fail('release.publishedAt', 'is not a parseable timestamp', 'ISO-8601 date', publishedAt)
  }

  let size: number | undefined
  if (release.size !== undefined && release.size !== null) {
    const n = release.size
    if (typeof n !== 'number' || !Number.isInteger(n) || n <= 0) {
      fail('release.size', 'must be a positive integer when present', 'positive integer', String(n))
    } else {
      size = n
    }
  }

  if (minecraftVersion && shortCommit && SHORT_SHA.test(shortCommit)) {
    const tag = releaseTag(channel, minecraftVersion, shortCommit)

    if (releaseUrl) {
      const expectedReleaseUrl = `https://github.com/${config.repository}/releases/tag/${tag}`
      if (releaseUrl !== expectedReleaseUrl) {
        fail('release.releaseUrl', 'does not point at the expected release tag', expectedReleaseUrl, releaseUrl)
      }
    }

    if (downloadUrl && assetName) {
      const expectedPrefix = `https://github.com/${config.repository}/releases/download/${tag}/`
      if (!downloadUrl.startsWith(expectedPrefix)) {
        fail(
          'release.downloadUrl',
          'does not point at the expected repository, tag and asset path',
          `${expectedPrefix}${assetName}`,
          downloadUrl,
        )
      } else {
        const segment = downloadUrl.slice(expectedPrefix.length).split(/[?#]/)[0]
        let decoded = segment
        try {
          decoded = decodeURIComponent(segment)
        } catch {
          fail('release.downloadUrl', 'asset path is not valid percent-encoding', encodeURIComponent(assetName), segment)
        }
        if (decoded !== assetName) {
          fail('release.downloadUrl', 'asset filename does not match metadata.assetName', assetName, decoded)
        }
      }
    } else if (downloadUrl) {
      const expectedPrefix = `https://github.com/${config.repository}/releases/download/${tag}/`
      if (!downloadUrl.startsWith(expectedPrefix)) {
        fail('release.downloadUrl', 'does not point at the expected repository and tag', expectedPrefix, downloadUrl)
      }
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return {
    ok: true,
    value: {
      channel,
      version: version!,
      minecraftVersion: minecraftVersion!,
      commit: commit!,
      shortCommit: shortCommit!,
      artifact: artifact!,
      assetName: assetName!,
      distributionArtifact: distributionArtifact ?? 'veltis.jar',
      minimumJavaVersion,
      downloadUrl: downloadUrl!,
      releaseUrl: releaseUrl!,
      publishedAt: publishedAt!,
      size,
    },
  }
}
