import { describe, it, expect } from 'vitest'
import {
  CHANNELS,
  CHANNEL_IDS,
  canonicalChannel,
  channelDefinition,
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

  it('accepts every published channel, including the legacy names', () => {
    for (const id of ['pre-alpha', 'alpha', 'beta', 'release', 'nightly', 'stable']) {
      expect(isReleaseChannel(id)).toBe(true)
      expect(CHANNEL_IDS).toContain(id)
    }
    expect(isReleaseChannel('canary')).toBe(false)
    expect(isReleaseChannel(undefined)).toBe(false)
  })

  it('groups the legacy stable alias under release without renaming it', () => {
    expect(canonicalChannel('stable')).toBe('release')
    expect(canonicalChannel('release')).toBe('release')
    expect(canonicalChannel('nightly')).toBe('nightly')
    expect(canonicalChannel('unknown')).toBeUndefined()
  })

  it('marks only the legacy identifiers as legacy', () => {
    expect(channelDefinition('nightly')?.legacy).toBe(true)
    expect(channelDefinition('stable')?.legacy).toBe(true)
    expect(channelDefinition('pre-alpha')?.legacy).toBe(false)
    expect(channelDefinition('release')?.legacy).toBe(false)
  })
})
