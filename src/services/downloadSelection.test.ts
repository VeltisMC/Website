import { describe, it, expect } from 'vitest'
import type { BuildInfo } from '../types/release'
import {
  eligibleBuilds,
  hasOfficialRelease,
  isOfficialRelease,
  primaryBuild,
} from './downloadSelection'

function build(partial: Partial<BuildInfo> & { id: string; channel: BuildInfo['channel'] }): BuildInfo {
  return {
    version: '1.0.0-SNAPSHOT',
    minecraftVersion: '26.3',
    publishedAt: '2026-10-10T12:00:00Z',
    commit: '3077e845f1cc04d4d7c9466406b4d76f3df12810',
    commitHash: '3077e84',
    commitMessage: 'build',
    downloadUrl: 'https://github.com/VeltisMC/Veltis/releases/download/tag/file.jar',
    artifact: 'Veltis 26.3 nightly 3077e84.jar',
    javaRequirement: 'Java 25+',
    changes: [],
    isPrerelease: partial.channel !== 'release' && partial.channel !== 'stable',
    ...partial,
  }
}

const release = build({ id: 'r', channel: 'release', publishedAt: '2026-10-09T00:00:00Z' })
const stable = build({ id: 's', channel: 'stable', publishedAt: '2026-10-01T00:00:00Z' })
const nightly = build({ id: 'n', channel: 'nightly', publishedAt: '2026-10-10T00:00:00Z' })
const preAlpha = build({ id: 'p', channel: 'pre-alpha', publishedAt: '2026-10-11T00:00:00Z' })

describe('download selection', () => {
  it('treats release and its legacy alias stable as the official line', () => {
    expect(isOfficialRelease(release)).toBe(true)
    expect(isOfficialRelease(stable)).toBe(true)
    expect(isOfficialRelease(nightly)).toBe(false)
    expect(isOfficialRelease(preAlpha)).toBe(false)
  })

  it('hides experimental builds until they are requested', () => {
    const all = [nightly, release, preAlpha]
    expect(eligibleBuilds(all, false).map((b) => b.id)).toEqual(['r'])
    expect(eligibleBuilds(all, true).map((b) => b.id)).toEqual(['p', 'n', 'r'])
  })

  it('selects the newest eligible build, newest first by publication time', () => {
    expect(primaryBuild([release, stable, nightly], false)?.id).toBe('r')
    expect(primaryBuild([release, stable, nightly], true)?.id).toBe('n')
  })

  it('does not promote an experimental build while experimental builds are hidden', () => {
    // No release exists: with the toggle off there is nothing to offer.
    expect(primaryBuild([nightly, preAlpha], false)).toBeUndefined()
    // With the toggle on, the newest experimental build is offered (never labelled stable).
    expect(primaryBuild([nightly, preAlpha], true)?.id).toBe('p')
  })

  it('reports whether any official release exists', () => {
    expect(hasOfficialRelease([nightly])).toBe(false)
    expect(hasOfficialRelease([nightly, release])).toBe(true)
    expect(hasOfficialRelease([stable])).toBe(true)
  })
})
