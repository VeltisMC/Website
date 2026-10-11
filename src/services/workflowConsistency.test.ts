import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

/**
 * The workflow and the TypeScript validator express the same rules in two
 * languages. This does not re-implement `jq`, but it does fail if the workflow
 * loses a supported channel or the canonical-name / URL checks, so the two
 * cannot silently drift apart.
 */
const workflow = readFileSync(
  resolve(process.cwd(), '.github', 'workflows', 'sync-release.yml'),
  'utf8',
)

describe('sync-release workflow', () => {
  it('accepts every published channel', () => {
    for (const channel of ['pre-alpha', 'alpha', 'beta', 'release', 'nightly', 'stable']) {
      expect(workflow).toContain(channel)
    }
  })

  it('keeps the canonical filename and URL rules', () => {
    expect(workflow).toContain('githubAssetName')
    expect(workflow).toContain('releases/download')
    expect(workflow).toContain('releases/tag')
    expect(workflow).toContain('fromdateiso8601')
  })

  it('only dispatches from the Veltis repository', () => {
    expect(workflow).toContain('RELEASE_REPOSITORY: VeltisMC/Veltis')
  })

  it('validates before it writes channel metadata', () => {
    const validateIndex = workflow.indexOf('Validate the release payload')
    const updateIndex = workflow.indexOf('Update the channel metadata')
    expect(validateIndex).toBeGreaterThan(-1)
    expect(updateIndex).toBeGreaterThan(validateIndex)
  })
})
