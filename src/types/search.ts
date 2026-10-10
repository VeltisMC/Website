export type SearchCategory = 'Documentation' | 'Guides' | 'Pages' | 'API'

export interface SearchResultItem {
  id: string
  title: string
  description: string
  url: string
  category: SearchCategory
  keywords?: string[]
}
