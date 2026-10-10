import type { ReactNode } from 'react'

export type DocSection =
  | 'Getting Started'
  | 'Server Administration'
  | 'Architecture'
  | 'Migration'

export interface DocHeading {
  id: string
  title: string
  level: number
}

export interface DocArticle {
  slug: string
  title: string
  description: string
  section: DocSection
  order: number
  headings: DocHeading[]
  content: () => ReactNode
}

export interface DocNavigationLink {
  slug: string
  title: string
}
