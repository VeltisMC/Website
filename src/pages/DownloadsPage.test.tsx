import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DownloadsPage from './DownloadsPage'
import type { BuildInfo } from '../types/release'
import { fetchReleases } from '../services/github'

vi.mock('../services/github', () => ({
  fetchReleases: vi.fn(),
}))

const fetchReleasesMock = vi.mocked(fetchReleases)

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
  publishedAt: '2026-10-11T12:00:00Z',
  downloadUrl: 'https://github.com/VeltisMC/Veltis/releases/download/tag/beta.jar',
  artifact: 'Veltis 26.3 beta 3077e84.jar',
  isPrerelease: true,
})

function result(builds: BuildInfo[]) {
  return {
    versions: { '26.3': { minecraftVersion: '26.3', builds } },
    isLiveGitHubData: false,
    sourceNote: 'Showing published Veltis release metadata.',
  }
}

describe('DownloadsPage', () => {
  beforeEach(() => {
    fetchReleasesMock.mockReset()
  })

  it('downloads the latest official release when one exists, even if a newer beta exists', async () => {
    fetchReleasesMock.mockResolvedValue(result([beta, release]))
    render(<DownloadsPage />)

    const link = await screen.findByRole('link', { name: `Download ${release.artifact}` })
    expect(link).toHaveAttribute('href', release.downloadUrl)
    // The experimental builds are hidden until the toggle is used.
    expect(screen.queryByText(beta.artifact)).toBeNull()
  })

  it('reveals experimental builds only when the toggle is used', async () => {
    fetchReleasesMock.mockResolvedValue(result([beta, release]))
    render(<DownloadsPage />)

    await screen.findByRole('link', { name: `Download ${release.artifact}` })
    expect(screen.queryByText(beta.artifact)).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /Show experimental builds/i }))
    expect(await screen.findByText(beta.artifact)).toBeInTheDocument()
  })

  it('shows an honest empty state and no download when only experimental builds exist', async () => {
    fetchReleasesMock.mockResolvedValue(result([beta]))
    render(<DownloadsPage />)

    await waitFor(() => expect(fetchReleasesMock).toHaveBeenCalled())
    expect(screen.queryByRole('link', { name: /Download/ })).toBeNull()
    expect(screen.getByText(/No official release build is available yet/i)).toBeInTheDocument()
  })

  it('shows an honest unavailable message when there are no builds at all', async () => {
    fetchReleasesMock.mockResolvedValue(
      result([]),
    )
    render(<DownloadsPage />)

    expect(
      await screen.findByText(/No published builds were found for this version/i),
    ).toBeInTheDocument()
  })
})