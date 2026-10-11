import { describe, it, expect } from 'vitest'
import {
  githubAssetName,
  releaseArtifactName,
  releaseTag,
  validateReleasePayload,
  type ReleasePayload,
  type NormalizedRelease,
} from './releaseValidation'

const REPO = 'VeltisMC/Veltis'
const COMMIT = '3077e845f1cc04d4d7c9466406b4d76f3df12810'
const SHORT = '3077e84'

/** Builds a valid payload for a channel; tests mutate one field at a time. */
function payloadFor(channel: string, overrides: Partial<ReleasePayload> = {}): ReleasePayload {
  const minecraftVersion = '26.3'
  const artifact = releaseArtifactName(minecraftVersion, channel, SHORT)
  const assetName = githubAssetName(artifact)
  const tag = releaseTag(channel, minecraftVersion, SHORT)
  return {
    metadata: {
      channel,
      version: '1.0.0-SNAPSHOT',
      minecraftVersion,
      commit: COMMIT,
      shortCommit: SHORT,
      artifact,
      assetName,
      distributionArtifact: 'veltis.jar',
      minimumJavaVersion: 25,
      ...(overrides.metadata ?? {}),
    },
    release: {
      downloadUrl: `https://github.com/${REPO}/releases/download/${tag}/${assetName}`,
      releaseUrl: `https://github.com/${REPO}/releases/tag/${tag}`,
      publishedAt: '2026-10-10T12:00:00Z',
      size: 12345,
      ...(overrides.release ?? {}),
    },
  }
}

function validate(payload: unknown) {
  return validateReleasePayload(payload, { repository: REPO })
}

function expectRejected(result: ReturnType<typeof validate>, field: string) {
  expect(result.ok).toBe(false)
  if (result.ok) return
  expect(result.issues.map((i) => i.field)).toContain(field)
}

function expectAccepted(result: ReturnType<typeof validate>): NormalizedRelease {
  expect(result.ok).toBe(true)
  if (!result.ok) throw new Error(`expected valid, got ${JSON.stringify(result.issues)}`)
  return result.value
}

describe('canonical filename rules', () => {
  it('folds the human title into the name GitHub stores', () => {
    expect(githubAssetName('Veltis 26.3 nightly 3077e84.jar')).toBe(
      'Veltis.26.3.nightly.3077e84.jar',
    )
  })

  it('collapses already-dotted input idempotently', () => {
    expect(githubAssetName('Veltis.26.3.nightly.3077e84.jar')).toBe(
      'Veltis.26.3.nightly.3077e84.jar',
    )
  })
})

describe('validateReleasePayload', () => {
  it('accepts a valid nightly payload (the one that was failing)', () => {
    const value = expectAccepted(validate(payloadFor('nightly')))
    expect(value.channel).toBe('nightly')
    expect(value.assetName).toBe('Veltis.26.3.nightly.3077e84.jar')
    expect(value.minimumJavaVersion).toBe(25)
  })

  it('accepts valid pre-alpha, alpha, beta, release and legacy stable payloads', () => {
    for (const channel of ['pre-alpha', 'alpha', 'beta', 'release', 'stable']) {
      const value = expectAccepted(validate(payloadFor(channel)))
      expect(value.channel).toBe(channel)
      expect(value.artifact).toBe(`Veltis 26.3 ${channel} ${SHORT}.jar`)
    }
  })

  it('rejects an unsupported channel', () => {
    expectRejected(validate(payloadFor('stable', { metadata: { channel: 'canary' } })), 'metadata.channel')
  })

  it('rejects the dotted-versus-spaced mismatch (assetName not GitHub form of artifact)', () => {
    const broken = payloadFor('nightly')
    broken.metadata!.assetName = 'Veltis 26.3 nightly 3077e84.jar'
    expectRejected(validate(broken), 'metadata.assetName')
  })

  it('rejects artifact and assetName that disagree', () => {
    const broken = payloadFor('nightly')
    broken.metadata!.assetName = 'Veltis.26.3.nightly.deadbee.jar'
    expectRejected(validate(broken), 'metadata.assetName')
  })

  it('rejects a malformed download URL', () => {
    const broken = payloadFor('nightly', { release: { downloadUrl: 'ftp://example.com/x.jar' } })
    expectRejected(validate(broken), 'release.downloadUrl')
  })

  it('rejects a URL for the wrong release tag', () => {
    const broken = payloadFor('nightly', {
      release: { downloadUrl: `https://github.com/${REPO}/releases/download/veltis-nightly-26.3-deadbee/Veltis.26.3.nightly.3077e84.jar` },
    })
    expectRejected(validate(broken), 'release.downloadUrl')
  })

  it('rejects a URL for the wrong repository', () => {
    const broken = payloadFor('nightly', {
      release: { downloadUrl: `https://github.com/SomeoneElse/Veltis/releases/download/${releaseTag('nightly', '26.3', SHORT)}/Veltis.26.3.nightly.3077e84.jar` },
    })
    expectRejected(validate(broken), 'release.downloadUrl')
  })

  it('rejects a download URL whose asset does not match assetName', () => {
    const broken = payloadFor('nightly', {
      release: { downloadUrl: `https://github.com/${REPO}/releases/download/${releaseTag('nightly', '26.3', SHORT)}/other.jar` },
    })
    expectRejected(validate(broken), 'release.downloadUrl')
  })

  it('rejects a releaseUrl pointing at a different tag', () => {
    const broken = payloadFor('nightly', {
      release: { releaseUrl: `https://github.com/${REPO}/releases/tag/veltis-nightly-26.3-deadbee` },
    })
    expectRejected(validate(broken), 'release.releaseUrl')
  })

  it('rejects a short commit that is not the prefix of the full commit', () => {
    const broken = payloadFor('nightly', { metadata: { shortCommit: 'deadbee' } })
    expectRejected(validate(broken), 'metadata.shortCommit')
  })

  it('rejects a malformed full commit', () => {
    expectRejected(validate(payloadFor('nightly', { metadata: { commit: 'not-a-sha' } })), 'metadata.commit')
  })

  it('rejects missing required metadata', () => {
    expectRejected(validate(payloadFor('nightly', { metadata: { version: '' } })), 'metadata.version')
    expectRejected(validate(payloadFor('nightly', { metadata: { minecraftVersion: '' } })), 'metadata.minecraftVersion')
  })

  it('rejects an artifact that does not follow the canonical convention', () => {
    const broken = payloadFor('nightly')
    broken.metadata!.artifact = 'veltis.jar'
    // assetName now disagrees as well, but the artifact rule must fire too.
    const result = validate(broken)
    expectRejected(result, 'metadata.artifact')
  })

  it('rejects a non-constant distribution artifact', () => {
    expectRejected(
      validate(payloadFor('nightly', { metadata: { distributionArtifact: 'Veltis 26.3 nightly 3077e84.jar' } })),
      'metadata.distributionArtifact',
    )
  })

  it('rejects an invalid Java requirement', () => {
    expectRejected(validate(payloadFor('nightly', { metadata: { minimumJavaVersion: 0 } })), 'metadata.minimumJavaVersion')
    expectRejected(validate(payloadFor('nightly', { metadata: { minimumJavaVersion: 3.5 } })), 'metadata.minimumJavaVersion')
  })

  it('accepts a payload that omits an optional size and Java requirement', () => {
    const value = expectAccepted(
      validate(payloadFor('nightly', { metadata: { minimumJavaVersion: null }, release: { size: null } })),
    )
    expect(value.minimumJavaVersion).toBeUndefined()
    expect(value.size).toBeUndefined()
  })

  it('rejects a non-positive size', () => {
    expectRejected(validate(payloadFor('nightly', { release: { size: 0 } })), 'release.size')
  })

  it('rejects an unparseable publication timestamp', () => {
    expectRejected(validate(payloadFor('nightly', { release: { publishedAt: 'yesterday' } })), 'release.publishedAt')
  })

  it('rejects a payload missing the metadata or release half', () => {
    expectRejected(validate({ release: {} }), 'metadata')
    expectRejected(validate({ metadata: {} }), 'release')
  })
})
