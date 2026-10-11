import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchReleases } from './github'

function okResponse(json: unknown): Response {
  return { ok: true, status: 200, json: async () => json } as unknown as Response
}

function notFound(): Response {
  return { ok: false, status: 404 } as unknown as Response
}

const stableFile = {
  channel: 'stable',
  latest: {
    channel: 'stable',
    version: '1.0.0-SNAPSHOT',
    minecraftVersion: '26.3',
    commit: '3077e845f1cc04d4d7c9466406b4d76f3df12810',
    shortCommit: '3077e84',
    artifact: 'Veltis 26.3 stable 3077e84.jar',
    assetName: 'Veltis.26.3.stable.3077e84.jar',
    distributionArtifact: 'veltis.jar',
    downloadUrl:
      'https://github.com/VeltisMC/Veltis/releases/download/veltis-stable-26.3-3077e84/Veltis.26.3.stable.3077e84.jar',
    releaseUrl: 'https://github.com/VeltisMC/Veltis/releases/tag/veltis-stable-26.3-3077e84',
    publishedAt: '2026-10-10T12:00:00Z',
    size: 100,
    minimumJavaVersion: 25,
  },
  history: [],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchReleases metadata path', () => {
  it('displays the canonical spaced artifact name, never the dotted assetName', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        return url.endsWith('/stable.json') ? okResponse(stableFile) : notFound()
      }),
    )
    const result = await fetchReleases()
    const builds = result.versions['26.3']?.builds ?? []
    expect(builds).toHaveLength(1)
    expect(builds[0].artifact).toBe('Veltis 26.3 stable 3077e84.jar')
    expect(builds[0].artifact).not.toContain('.stable.')
    expect(builds[0].channel).toBe('stable')
    expect(result.versions['26.3']?.latestRelease?.commitHash).toBe('3077e84')
  })

  it('rejects a metadata file whose channel is not supported', async () => {
    const badNightly = {
      ...stableFile,
      channel: 'nightly',
      latest: { ...stableFile.latest, channel: 'nightly' },
    } as unknown as typeof stableFile
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        return url.endsWith('/stable.json') ? okResponse(badNightly) : notFound()
      }),
    )
    const result = await fetchReleases()
    const withBuilds = Object.values(result.versions).some((v) => v.builds.length > 0)
    expect(withBuilds).toBe(false)
  })
})

describe('fetchReleases GitHub fallback', () => {
  it('never infers a channel that a release does not encode', async () => {
    const releases = [
      {
        id: 1,
        tag_name: 'veltis-something-26.3-aaaaaaa',
        name: 'Veltis 26.3 something aaaaaaa',
        body: '',
        prerelease: true,
        draft: false,
        published_at: '2026-10-10T12:00:00Z',
        html_url: 'https://github.com/VeltisMC/Veltis/releases/tag/x',
        assets: [
          {
            id: 1,
            name: 'Veltis.26.3.something.aaaaaaa.jar',
            browser_download_url:
              'https://github.com/VeltisMC/Veltis/releases/download/x/Veltis.26.3.something.aaaaaaa.jar',
            size: 1,
            created_at: '2026-10-10T12:00:00Z',
          },
        ],
      },
      {
        id: 2,
        tag_name: 'veltis-nightly-26.3-bbbbbbb',
        name: 'Veltis 26.3 nightly bbbbbbb',
        body: '',
        prerelease: true,
        draft: false,
        published_at: '2026-10-10T13:00:00Z',
        html_url: 'https://github.com/VeltisMC/Veltis/releases/tag/n',
        assets: [
          {
            id: 2,
            name: 'Veltis.26.3.nightly.bbbbbbb.jar',
            browser_download_url:
              'https://github.com/VeltisMC/Veltis/releases/download/n/Veltis.26.3.nightly.bbbbbbb.jar',
            size: 1,
            created_at: '2026-10-10T13:00:00Z',
          },
        ],
      },
      {
        id: 3,
        tag_name: 'veltis-pre-alpha-26.3-ccccccc',
        name: 'Veltis 26.3 pre-alpha ccccccc',
        body: '',
        prerelease: true,
        draft: false,
        published_at: '2026-10-10T14:00:00Z',
        html_url: 'https://github.com/VeltisMC/Veltis/releases/tag/p',
        assets: [
          {
            id: 3,
            name: 'Veltis.26.3.pre-alpha.ccccccc.jar',
            browser_download_url:
              'https://github.com/VeltisMC/Veltis/releases/download/p/Veltis.26.3.pre-alpha.ccccccc.jar',
            size: 1,
            created_at: '2026-10-10T14:00:00Z',
          },
        ],
      },
    ]
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.startsWith('https://api.github.com/')) return okResponse(releases)
        return notFound()
      }),
    )
    const result = await fetchReleases()
    const builds = result.versions['26.3']?.builds ?? []
    // Neither the unknown "something" build (prerelease, but no supported
    // channel in the name) nor the retired nightly build is offered; only the
    // explicitly-encoded pre-alpha release survives.
    expect(builds).toHaveLength(1)
    expect(builds[0].channel).toBe('pre-alpha')
  })
})