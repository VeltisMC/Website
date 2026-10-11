/**
 * The download page's selection rules, kept pure so they can be unit-tested
 * without rendering and so the page cannot disagree with itself about which
 * build is "the" download.
 */
import type { BuildInfo } from '../types/release'
import { canonicalChannel } from '../config/channels'

/** True for a build on the official release line (canonical `release`). */
export function isOfficialRelease(build: BuildInfo): boolean {
  return canonicalChannel(build.channel) === 'release'
}

/** Newest first, by publication time. Never invents an order. */
export function byNewest(builds: BuildInfo[]): BuildInfo[] {
  return [...builds].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/**
 * The builds a visitor may currently pick from. When experimental builds are
 * hidden, only the official release line remains — a nightly is never offered
 * as if it were a release.
 */
export function eligibleBuilds(builds: BuildInfo[], includeExperimental: boolean): BuildInfo[] {
  const sorted = byNewest(builds)
  return includeExperimental ? sorted : sorted.filter(isOfficialRelease)
}

/**
 * The build the primary button should download: the newest eligible build.
 * This is the newest official release when one exists, and — only when
 * experimental builds are shown — the newest experimental build otherwise.
 * Returns undefined when nothing is eligible, so callers show an honest empty
 * state instead of a fake download.
 */
export function primaryBuild(builds: BuildInfo[], includeExperimental: boolean): BuildInfo | undefined {
  return eligibleBuilds(builds, includeExperimental)[0]
}

/** True when at least one official release exists among the given builds. */
export function hasOfficialRelease(builds: BuildInfo[]): boolean {
  return builds.some(isOfficialRelease)
}
