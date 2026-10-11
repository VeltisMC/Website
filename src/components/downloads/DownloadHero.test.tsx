import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DownloadHero from './DownloadHero'
import type { BuildInfo } from '../../types/release'

function build(partial: Partial<BuildInfo> & { id: string; channel: BuildInfo['channel'] }): BuildInfo {
  return {
    version: '1.0.0-SNAPSHOT',
    minecraftVersion: '26.3',
    publishedAt: '2026-10-10T12:00:00Z',
    commit: '3077e845f1cc04d4d7c9466406b4d76f3df12810',
    commitHash: '3077e84',
    commitMessage: 'build',
    downloadUrl: 'https://github.com/VeltisMC/Veltis/releases/download/tag/release.jar',
    artifact: 'Veltis 26.3 release 3077e84.jar',
    javaRequirement: 'Java 25+',
    changes: [],
    isPrerelease: false,
    ...partial,
  }
}

const release = build({ id: 'r', channel: 'release' })
const beta = build({
  id: 'b',
  channel: 'beta',
  downloadUrl: 'https://github.com/VeltisMC/Veltis/releases/download/tag/beta.jar',
  artifact: 'Veltis 26.3 beta 3077e84.jar',
  isPrerelease: true,
})
const preAlpha = build({
  id: 'p',
  channel: 'pre-alpha',
  artifact: 'Veltis 26.3 pre-alpha 3077e84.jar',
  isPrerelease: true,
})

function noop() {}

describe('DownloadHero', () => {
  it('points the primary action at the selected build’s real asset URL', () => {
    render(
      <DownloadHero
        minecraftVersion="26.3"
        primary={release}
        builds={[release]}
        hasRelease
        includeExperimental={false}
        loading={false}
        onToggleExperimental={noop}
        onSelectBuild={noop}
        onRetry={noop}
      />,
    )
    const link = screen.getByRole('link', { name: `Download ${release.artifact}` })
    expect(link).toHaveAttribute('href', release.downloadUrl)
  })

  it('shows the channel name, not only its colour', () => {
    render(
      <DownloadHero
        minecraftVersion="26.3"
        primary={preAlpha}
        builds={[preAlpha]}
        hasRelease={false}
        includeExperimental
        loading={false}
        onToggleExperimental={noop}
        onSelectBuild={noop}
        onRetry={noop}
      />,
    )
    expect(screen.getAllByText('Pre-alpha').length).toBeGreaterThan(0)
  })

  it('never offers a download when no build is eligible', () => {
    render(
      <DownloadHero
        builds={[]}
        hasRelease={false}
        includeExperimental={false}
        loading={false}
        onToggleExperimental={noop}
        onSelectBuild={noop}
        onRetry={noop}
      />,
    )
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('No builds available')).toBeInTheDocument()
  })

  it('explains that no official release exists instead of faking one', () => {
    render(
      <DownloadHero
        builds={[beta]}
        hasRelease={false}
        includeExperimental
        loading={false}
        onToggleExperimental={noop}
        onSelectBuild={noop}
        onRetry={noop}
      />,
    )
    expect(screen.getByText(/No official release build is available yet/i)).toBeInTheDocument()
  })

  it('invokes the experimental toggle callback', () => {
    const onToggleExperimental = vi.fn()
    render(
      <DownloadHero
        builds={[release]}
        hasRelease
        includeExperimental={false}
        loading={false}
        onToggleExperimental={onToggleExperimental}
        onSelectBuild={noop}
        onRetry={noop}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /Show experimental builds/i }))
    expect(onToggleExperimental).toHaveBeenCalledTimes(1)
  })

  it('opens the build dropdown and selects a build', () => {
    const onSelectBuild = vi.fn()
    render(
      <DownloadHero
        builds={[release, beta]}
        hasRelease
        includeExperimental
        loading={false}
        onToggleExperimental={noop}
        onSelectBuild={onSelectBuild}
        onRetry={noop}
      />,
    )
    expect(screen.queryByRole('menu')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /Choose a different build/i }))
    const options = screen.getAllByRole('menuitemradio')
    expect(options).toHaveLength(2)
    fireEvent.click(screen.getByRole('menuitemradio', { name: /Beta build/i }))
    expect(onSelectBuild).toHaveBeenCalledWith(beta.id)
  })
})