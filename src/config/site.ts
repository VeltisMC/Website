export const siteConfig = {
  name: 'Veltis',
  fullName: 'VeltisMC',
  title: 'Veltis — Minecraft Server Software. Re-engineered.',
  description:
    'Veltis is a high-performance Minecraft server built around a simple idea: keep vanilla Minecraft at the center, and improve how it runs. It works directly with Minecraft\'s server code and adds its own runtime and world engine.',
  url: 'https://www.veltismc.org',
  github: 'https://github.com/VeltisMC/Veltis',
  githubRepo: 'VeltisMC/Veltis',
  githubOrg: 'https://github.com/VeltisMC',
  discord: 'https://discord.com/invite/239MkjVmZw',
  documentationUrl: '/docs',
  license: 'GPL-3.0',
  defaultMinecraftVersion: '26.3',
  supportedMinecraftVersions: ['26.3'],
  javaRequirement: 'Java 25+',
  releasesBasePath: '/releases',
} as const

export type SiteConfig = typeof siteConfig
