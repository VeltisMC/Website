import { describe, it, expect } from 'vitest'
import {
  CHANNELS,
  CHANNEL_IDS,
  RELEASE_CANONICAL,
  canonicalChannel,
  channelDefinition,
  isCurrentChannel,
  isReleaseChannel,
} from './channels'

describe('channel registry', () => {
  it('defines the requested colours exactly', () => {
    expect(channelDefinition('pre-alpha')?.color).toBe('#8B0000')
    expect(channelDefinition('alpha')?.color).toBe('#EF4444')
    expect(channelDefinition('beta')?.color).toBe('#FACC15')
    expect(channelDefinition('release')?.color).toBe('#A855F7')
  })

  it('always carries a display name alongside the colour', () => {
    for (const channel of CHANNELS) {
      expect(channel.label.length).toBeGreaterThan(0)
      expect(channel.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(channel.textColor).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })

  it('accepts every current channel plus the legacy stable alias, and nothing else', () => {
    for (const id of ['pre-alpha', 'alpha', 'beta', 'release', 'stable']) {
      expect(isReleaseChannel(id)).toBe(true)
      expect(CHANNEL_IDS).toContain(id)
    }
    expect(isReleaseChannel('nightly')).toBe(false)
    expect(isReleaseChannel('canary')).toBe(false)
    expect(isReleaseChannel(undefined)).toBe(false)
  })

  it('removes the retired nightly channel from every list and lookup', () => {
    expect(CHANNEL_IDS).not.toContain('nightly')
    expect(CHANNELS.find((c) => c.id === ('nightly' as string))).toBeUndefined()
    expect(channelDefinition('nightly')).toBeUndefined()
    expect(canonicalChannel('nightly')).toBeUndefined()
    expect(CHANNELS.some((c) => c.label === 'Nightly')).toBe(false)
  })

  it('identifies exactly the four current channels as producible', () => {
    for (const id of ['pre-alpha', 'alpha', 'beta', 'release']) {
      expect(isCurrentChannel(id)).toBe(true)
    }
    // `stable` is a read-only legacy alias, never produced by a new build.
    expect(isCurrentChannel('stable')).toBe(false)
    expect(isCurrentChannel('nightly')).toBe(false)
  })

  it('groups the legacy stable alias under release without renaming it', () => {
    expect(canonicalChannel('stable')).toBe('release')
    expect(canonicalChannel('release')).toBe('release')
    expect(canonicalChannel('pre-alpha')).toBe('pre-alpha')
    expect(canonicalChannel('unknown')).toBeUndefined()
  })

  it('marks only the legacy identifiers as legacy', () => {
    expect(channelDefinition('stable')?.legacy).toBe(true)
    expect(channelDefinition('pre-alpha')?.legacy).toBe(false)
    expect(channelDefinition('beta')?.legacy).toBe(false)
    expect(channelDefinition('release')?.legacy).toBe(false)
  })

  it('names release as the canonical official channel', () => {
    expect(RELEASE_CANONICAL).toBe('release')
    expect(channelDefinition(RELEASE_CANONICAL)?.prerelease).toBe(false)
  })
})