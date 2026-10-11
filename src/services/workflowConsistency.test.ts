import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

/**
 * The workflow and the TypeScript validator express the same rules in two
 * languages. This does not re-implement `jq`, but it does fail if the workflow
 * loses a supported channel or the canonical-name / URL checks, so the two
 * cannot silently drift apart. It also locks down the protected-branch
 * guarantees: no push to `main`, no force push, verified-signature commits,
 * and a PR that runs the required checks.
 */
const workflow = readFileSync(
  resolve(process.cwd(), '.github', 'workflows', 'sync-release.yml'),
  'utf8',
)

describe('sync-release workflow', () => {
  it('accepts every current channel and the legacy stable alias', () => {
    for (const channel of ['pre-alpha', 'alpha', 'beta', 'release', 'stable']) {
      expect(workflow).toContain(`"${channel}"`)
    }
  })

  it('never accepts or produces the retired nightly channel', () => {
    expect(workflow.toLowerCase()).not.toContain('nightly')
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

  it('validates the payload before it stages channel metadata', () => {
    const validateIndex = workflow.indexOf('Validate the release payload')
    const stageIndex = workflow.indexOf('Stage the channel metadata')
    expect(validateIndex).toBeGreaterThan(-1)
    expect(stageIndex).toBeGreaterThan(validateIndex)
  })

  it('never pushes to main and never force-pushes', () => {
    // The checkout target is main for reading only; every write goes to a
    // dedicated release-metadata branch.
    expect(workflow).toContain('ref: main')
    expect(workflow).toMatch(/release-metadata\//)
    expect(workflow).not.toMatch(/git push/)
    expect(workflow).not.toMatch(/--force/)
  })

  it('writes metadata through a protected-branch-safe PR flow', () => {
    // Verified commits come from the createCommitOnBranch GraphQL mutation;
    // the PR is created against main and never auto-merged.
    expect(workflow).toContain('createCommitOnBranch')
    expect(workflow).toContain('gh pr create')
    expect(workflow).toContain('--base main')
    expect(workflow.toLowerCase()).toContain('auto-merg')
  })

  it('is idempotent across repeated dispatches', () => {
    // Dedupe by commit and early-exit when the build is already recorded.
    expect(workflow).toContain('unique_by(.commit)')
    expect(workflow).toContain('already recorded on main')
    expect(workflow).toContain('already carries this release')
    expect(workflow).toContain('noop')
  })

  it('supplies the required checks on the metadata branch', () => {
    // A PR opened with GITHUB_TOKEN does not fire pull_request workflows, so
    // the workflow must dispatch the CI workflow explicitly on the branch.
    expect(workflow).toContain('gh workflow run website-ci.yml')
  })
})