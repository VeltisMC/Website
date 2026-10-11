import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const src = (p: string) => resolve(process.cwd(), 'src', p)

describe('removed website sections', () => {
  const removedRoutes = ['/roadmap', '/shulker', '/architecture']

  it('has no routes, nav entries, footer links or search results for the removed pages', () => {
    const app = readFileSync(src('App.tsx'), 'utf8')
    for (const route of removedRoutes) {
      expect(app).not.toContain(`path="${route}"`)
    }

    const nav = readFileSync(src('config/navigation.ts'), 'utf8')
    for (const route of removedRoutes) {
      expect(nav).not.toContain(route)
    }

    const footer = readFileSync(src('components/common/Footer.tsx'), 'utf8')
    expect(footer).not.toContain('/roadmap')

    const search = readFileSync(src('services/searchIndex.ts'), 'utf8')
    for (const route of removedRoutes) {
      expect(search).not.toContain(`url: '${route}'`)
    }
  })

  it('removes the pages and their supporting modules from the tree', () => {
    const gone = [
      'pages/RoadmapPage.tsx',
      'pages/ShulkerPage.tsx',
      'pages/ArchitecturePage.tsx',
      'config/roadmap.ts',
      'components/common/ArchitectureDiagram.tsx',
    ]
    for (const file of gone) {
      expect(existsSync(src(file)), `${file} should have been removed`).toBe(false)
    }
  })

  it('drops the removed pages from the sitemap', () => {
    const sitemap = readFileSync(resolve(process.cwd(), 'public', 'sitemap.xml'), 'utf8')
    for (const route of ['/architecture', '/shulker', '/roadmap']) {
      expect(sitemap).not.toContain(`veltismc.org${route}`)
    }
  })
})

describe('nightly is fully retired on the website', () => {
  // Comments may explain the retirement, so the check is against the functional
  // forms only: quoted literals and identifiers that would make `nightly` a
  // usable value, never against prose.
  const functionalNightly = [/'nightly'/, /"nightly"/, /latestNightly/]
  const files = [
    'config/channels.ts',
    'types/release.ts',
    'services/github.ts',
    'services/releaseValidation.ts',
    'services/downloadSelection.ts',
    'services/searchIndex.ts',
    'components/common/ChannelBadge.tsx',
    'components/downloads/DownloadHero.tsx',
    'pages/ChangelogPage.tsx',
    'pages/DownloadsPage.tsx',
    'pages/HomePage.tsx',
  ]

  it('never uses nightly as a value, key, selector or identifier', () => {
    for (const file of files) {
      const content = readFileSync(src(file), 'utf8')
      for (const pattern of functionalNightly) {
        expect(content, `${file} still uses nightly as a value`).not.toMatch(pattern)
      }
    }
  })
})