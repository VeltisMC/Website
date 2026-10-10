import type { DocArticle, DocSection } from '../../types/docs'
import { gettingStartedDocs } from './gettingStarted'
import { serverAdminDocs } from './serverAdmin'
import { architectureDocs } from './architectureDocs'
import { migrationDocs } from './migration'

export const allDocs: DocArticle[] = [
  ...gettingStartedDocs,
  ...serverAdminDocs,
  ...architectureDocs,
  ...migrationDocs,
]

export const docSections: DocSection[] = [
  'Getting Started',
  'Server Administration',
  'Architecture',
  'Migration',
]

export function getDocBySlug(slug: string): DocArticle | undefined {
  return allDocs.find((d) => d.slug === slug)
}

export function getDocsBySection(section: DocSection): DocArticle[] {
  return allDocs.filter((d) => d.section === section).sort((a, b) => a.order - b.order)
}

export function getAdjacentDocs(currentSlug: string): {
  prev?: DocArticle
  next?: DocArticle
} {
  const currentIndex = allDocs.findIndex((d) => d.slug === currentSlug)
  if (currentIndex === -1) return {}
  return {
    prev: currentIndex > 0 ? allDocs[currentIndex - 1] : undefined,
    next: currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : undefined,
  }
}
