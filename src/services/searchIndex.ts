import type { SearchResultItem } from '../types/search'
import { allDocs } from '../content/docs'

export function getSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = []

  // Core Pages
  items.push(
    {
      id: 'page-home',
      title: 'Home',
      description: 'Minecraft server software. Re-engineered. High performance runtime and architecture.',
      url: '/',
      category: 'Pages',
      keywords: ['veltis', 'minecraft', 'server', 'optimization', 'performance'],
    },
    {
      id: 'page-downloads',
      title: 'Downloads & Releases',
      description: 'Download the latest stable, beta, and nightly builds for Minecraft 26.3 and more.',
      url: '/downloads',
      category: 'Pages',
      keywords: ['download', 'jar', 'releases', 'builds', 'stable', 'beta', 'nightly', 'sha256'],
    },
    {
      id: 'page-developers',
      title: 'Developer Portal & Native API',
      description: 'Build native Veltis extensions with capability-driven lifecycle, safe concurrency, and Gradle setup.',
      url: '/developers',
      category: 'API',
      keywords: ['developers', 'api', 'plugin', 'extension', 'concurrency', 'gradle', 'maven'],
    },
    {
      id: 'page-architecture',
      title: 'System Architecture',
      description: 'Explore the Veltis partitioned tick loop, memory layout, SIMD vectorization, and runtime topology.',
      url: '/architecture',
      category: 'Pages',
      keywords: ['architecture', 'runtime', 'tick', 'scheduler', 'vector', 'simd', 'netty'],
    },
    {
      id: 'page-shulker',
      title: 'Shulker Patch Engine',
      description: 'The Git-based patch automation pipeline that powers Veltis. "Vanilla lifted. Veltis dropped."',
      url: '/shulker',
      category: 'Pages',
      keywords: ['shulker', 'patches', 'git', 'rebase', 'upstream', 'decompilation'],
    },
    {
      id: 'page-roadmap',
      title: 'Project Roadmap',
      description: 'Development milestones: completed, in-progress, planned, and research investigations.',
      url: '/roadmap',
      category: 'Pages',
      keywords: ['roadmap', 'milestones', 'progress', 'future', 'issues'],
    },
    {
      id: 'page-community',
      title: 'Community & Support',
      description: 'Join the Veltis developer community on Discord, GitHub Discussions, and issue trackers.',
      url: '/community',
      category: 'Pages',
      keywords: ['community', 'discord', 'github', 'support', 'discussions', 'help'],
    },
    {
      id: 'page-contributing',
      title: 'Contributing Guidelines',
      description: 'How to contribute to Veltis: setup, code style, Shulker patch workflow, and pull requests.',
      url: '/contributing',
      category: 'Pages',
      keywords: ['contribute', 'pr', 'pull request', 'patch', 'code style', 'checkstyle'],
    },
    {
      id: 'page-changelog',
      title: 'Changelog & Release Notes',
      description: 'Detailed version history, bug fixes, performance optimizations, and breaking changes.',
      url: '/changelog',
      category: 'Pages',
      keywords: ['changelog', 'history', 'release notes', 'changes'],
    },
    {
      id: 'page-license',
      title: 'GPL-3.0 License',
      description: 'Open source licensing, rights, warranties, and obligations under GNU General Public License v3.',
      url: '/license',
      category: 'Pages',
      keywords: ['license', 'gpl', 'open source', 'legal'],
    },
  )

  // Documentation Articles
  allDocs.forEach((doc) => {
    items.push({
      id: `doc-${doc.slug}`,
      title: doc.title,
      description: doc.description,
      url: `/docs/${doc.slug}`,
      category: 'Documentation',
      keywords: [doc.section.toLowerCase(), ...doc.headings.map((h) => h.title.toLowerCase())],
    })

    // Index subheadings
    doc.headings.forEach((heading) => {
      items.push({
        id: `doc-${doc.slug}-${heading.id}`,
        title: `${doc.title} › ${heading.title}`,
        description: `Section inside ${doc.title} (${doc.section})`,
        url: `/docs/${doc.slug}#${heading.id}`,
        category: 'Documentation',
        keywords: [heading.title.toLowerCase(), doc.slug],
      })
    })
  })

  return items
}

export function searchSite(query: string): SearchResultItem[] {
  const clean = query.trim().toLowerCase()
  if (!clean) return []

  const index = getSearchIndex()
  return index.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(clean)
    const descMatch = item.description.toLowerCase().includes(clean)
    const keywordMatch = item.keywords?.some((k) => k.includes(clean))
    return titleMatch || descMatch || keywordMatch
  })
}
