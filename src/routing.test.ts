import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()

function applicationRoutes(): Set<string> {
  const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8')
  const routes = new Set(
    [...app.matchAll(/<Route path="([^"]+)"/g)]
      .map(([, path]) => path)
      .filter((path) => path.startsWith('/')),
  )

  const docsDirectory = resolve(root, 'src/content/docs')
  for (const file of readdirSync(docsDirectory).filter((name) => name.endsWith('.tsx'))) {
    const content = readFileSync(resolve(docsDirectory, file), 'utf8')
    for (const [, slug] of content.matchAll(/slug:\s*'([^']+)'/g)) {
      routes.add(`/docs/${slug}`)
    }
  }
  return routes
}

describe('production route rewrites', () => {
  it('rewrites every application route exactly and preserves platform 404s', () => {
    const config = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8')) as {
      rewrites: { source: string; destination: string }[]
    }
    const routes = applicationRoutes()
    const rewriteSources = config.rewrites.map(({ source }) => source)

    expect(new Set(rewriteSources)).toEqual(routes)
    expect(config.rewrites.every(({ destination }) => destination === '/index.html')).toBe(true)
    expect(rewriteSources.some((source) => /[*:?()]/.test(source))).toBe(false)

    for (const path of ['/assets/main.js', '/api/health', '/releases/stable.json', '/unknown-route']) {
      expect(rewriteSources).not.toContain(path)
    }
  })
})
