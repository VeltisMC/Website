/**
 * The single source of truth for release channels.
 *
 * <p>Every place that names, colours, sorts or groups a channel reads from this
 * module — badges, the download hero, the experimental-build toggle, the build
 * list, filters and release-history logic. Colours are defined once here as hex
 * values (not scattered Tailwind utility strings) so a badge can be rendered
 * with an inline style and stay correct for channels Tailwind did not generate a
 * class for.
 *
 * <p>The taxonomy the organisation publishes under is `pre-alpha`, `alpha`,
 * `beta` and `release`. One older identifier is kept alongside them because the
 * build pipeline already published under it and its history must stay readable:
 *
 *   * `stable` is the earlier name for an official release. `stable` and
 *     `release` are aliases of one concept, so `stable` maps to the canonical
 *     `release` for grouping and display while the raw stored value is never
 *     rewritten.
 *
 * <p>`nightly` is deliberately absent. It was never a supported current channel
 * and is not renamed into one: a build that used it stays reachable through the
 * original GitHub Releases, but it is not a channel the site offers, filters on
 * or presents as a downloadable build.
 */

/** Every channel identifier the site will accept from stored metadata. */
export type ReleaseChannel =
  | 'pre-alpha'
  | 'alpha'
  | 'beta'
  | 'release'
  // Legacy identifier, retained for backwards compatibility only.
  | 'stable'

export interface ChannelDefinition {
  /** The identifier as stored in release metadata. Never rewritten. */
  id: ReleaseChannel
  /** Full human label. Always shown next to the colour; colour is never alone. */
  label: string
  /** Compact label for dense controls. */
  shortLabel: string
  /** One-line meaning, used in tooltips and notes. */
  description: string
  /** Badge/swatch background. */
  color: string
  /** Foreground colour verified to contrast against {@link color}. */
  textColor: string
  /** True when the channel is not an official release. */
  prerelease: boolean
  /**
   * The canonical channel this identifier groups under. `stable` groups under
   * `release`; every other identifier is its own canonical channel.
   */
  canonical: ReleaseChannel
  /** True for identifiers kept only so older published metadata still reads. */
  legacy: boolean
  /** Sort order, most experimental first. */
  order: number
}

/**
 * The registry, in display order (most experimental first). The requested
 * colours are used exactly: pre-alpha `#8B0000`, alpha `#EF4444`, beta
 * `#FACC15`, release `#A855F7`. The legacy `stable` identifier keeps the
 * identity the site already used so existing history is not recoloured into a
 * different meaning.
 */
export const CHANNELS: readonly ChannelDefinition[] = [
  {
    id: 'pre-alpha',
    label: 'Pre-alpha',
    shortLabel: 'Pre-alpha',
    description: 'Very early development builds. Highly experimental; expect breakage.',
    color: '#8B0000',
    textColor: '#FFFFFF',
    prerelease: true,
    canonical: 'pre-alpha',
    legacy: false,
    order: 0,
  },
  {
    id: 'alpha',
    label: 'Alpha',
    shortLabel: 'Alpha',
    description: 'Early testing builds. Unstable and subject to change.',
    color: '#EF4444',
    textColor: '#FFFFFF',
    prerelease: true,
    canonical: 'alpha',
    legacy: false,
    order: 1,
  },
  {
    id: 'beta',
    label: 'Beta',
    shortLabel: 'Beta',
    description: 'Testing builds that are further along than alpha.',
    color: '#FACC15',
    textColor: '#1C1917',
    prerelease: true,
    canonical: 'beta',
    legacy: false,
    order: 2,
  },
  {
    id: 'release',
    label: 'Release',
    shortLabel: 'Release',
    description: 'Official release channel. Recommended for production servers.',
    color: '#A855F7',
    textColor: '#FFFFFF',
    prerelease: false,
    canonical: 'release',
    legacy: false,
    order: 3,
  },
  {
    id: 'stable',
    label: 'Stable',
    shortLabel: 'Stable',
    description: 'Earlier name for the official release channel.',
    color: '#A855F7',
    textColor: '#FFFFFF',
    prerelease: false,
    canonical: 'release',
    legacy: true,
    order: 4,
  },
]

const BY_ID: Record<string, ChannelDefinition> = Object.fromEntries(
  CHANNELS.map((c) => [c.id, c]),
)

/** Every accepted identifier, for validation. */
export const CHANNEL_IDS: readonly ReleaseChannel[] = CHANNELS.map((c) => c.id)

/**
 * Identifiers the download page reads per-channel metadata files for. Ordered
 * so the most relevant channel file is fetched first. `stable` is included so a
 * legacy file that was already published still reads.
 */
export const RELEASE_CHANNEL_IDS: readonly ReleaseChannel[] = CHANNELS.map((c) => c.id)

/** The channels offered as first-class downloads, canonical labels only. */
export const PRIMARY_CHANNELS: readonly ChannelDefinition[] = CHANNELS.filter(
  (c) => !c.legacy,
)

/**
 * True for the identifiers a new build may be published under — the four
 * current channels. `stable` is excluded: it is read, never produced.
 */
export function isCurrentChannel(value: unknown): value is ReleaseChannel {
  return (
    typeof value === 'string' &&
    value in BY_ID &&
    !BY_ID[value].legacy
  )
}

export function isReleaseChannel(value: unknown): value is ReleaseChannel {
  return typeof value === 'string' && value in BY_ID
}

/** Looks a channel up, tolerating unknown values by returning undefined. */
export function channelDefinition(id: string): ChannelDefinition | undefined {
  return BY_ID[id]
}

/**
 * The canonical channel an identifier groups under. Unknown identifiers return
 * `undefined` so callers can decide how to present an unrecognised channel
 * rather than silently pretending it is a release.
 */
export function canonicalChannel(id: string): ReleaseChannel | undefined {
  return BY_ID[id]?.canonical
}

/** Order helper for sorting builds; unknown channels sort last. */
export function channelOrder(id: string): number {
  return BY_ID[id]?.order ?? Number.MAX_SAFE_INTEGER
}

/** The channel the primary download button targets: the official release line. */
export const RELEASE_CANONICAL: ReleaseChannel = 'release'
