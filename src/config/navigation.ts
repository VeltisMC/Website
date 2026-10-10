export interface NavItem {
  label: string
  href: string
  badge?: string
  external?: boolean
}

export interface FooterSection {
  title: string
  items: NavItem[]
}

export const mainNav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/docs', label: 'Documentation' },
  { href: '/developers', label: 'Developers' },
  { href: '/community', label: 'Community' },
]

export const footerSections: FooterSection[] = [
  {
    title: 'Software',
    items: [
      { href: '/downloads', label: 'Downloads' },
      { href: '/changelog', label: 'Release Notes' },
      { href: '/roadmap', label: 'Project Roadmap' },
      { href: '/developers', label: 'Developer Portal' },
    ],
  },
  {
    title: 'Documentation',
    items: [
      { href: '/docs', label: 'Getting Started' },
      { href: '/docs/prerequisites', label: 'Prerequisites (Java 25+)' },
      { href: '/docs/startup-flags', label: 'Server Administration' },
      { href: '/docs/migrating-from-paper', label: 'Migration Guide' },
      { href: '/docs/troubleshooting', label: 'Troubleshooting' },
    ],
  },
  {
    title: 'Developers',
    items: [
      { href: '/architecture', label: 'System Architecture' },
      { href: '/shulker', label: 'Shulker Patch Engine' },
      { href: '/developers', label: 'API Development (WIP)' },
      { href: '/contributing', label: 'Contributing to Veltis' },
    ],
  },
  {
    title: 'Community & Project',
    items: [
      { href: '/community', label: 'Community Hub' },
      { href: 'https://discord.com/invite/239MkjVmZw', label: 'Discord Server', external: true },
      { href: 'https://github.com/VeltisMC/Veltis', label: 'GitHub Repository', external: true },
      { href: '/license', label: 'GPL-3.0 License' },
    ],
  },
]
