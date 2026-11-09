import { readFile } from 'node:fs/promises'
import { preview } from 'vite'

const config = JSON.parse(await readFile('vercel.json', 'utf8'))
const server = await preview({
  preview: {
    host: '127.0.0.1',
    port: 0,
    strictPort: true,
  },
})

try {
  const address = server.httpServer.address()
  if (!address || typeof address === 'string') {
    throw new Error('Production preview did not expose a TCP address')
  }
  const origin = `http://127.0.0.1:${address.port}`

  for (const { source } of config.rewrites) {
    const response = await fetch(new URL(source, origin), {
      headers: { Accept: 'text/html' },
    })
    if (!response.ok) {
      throw new Error(`Direct request for ${source} returned HTTP ${response.status}`)
    }
    const html = await response.text()
    if (!html.includes('<div id="root">')) {
      throw new Error(`Direct request for ${source} did not return the application shell`)
    }
  }

  const home = await fetch(origin, { headers: { Accept: 'text/html' } })
  const html = await home.text()
  const scriptPath = html.match(/<script[^>]+src="([^"]+\.js)"/)?.[1]
  if (!scriptPath) {
    throw new Error('Production application shell did not reference a JavaScript bundle')
  }

  const script = await fetch(new URL(scriptPath, origin))
  if (!script.ok || !(script.headers.get('content-type') ?? '').includes('javascript')) {
    throw new Error(`Production JavaScript bundle was not served correctly (HTTP ${script.status})`)
  }

  console.log(`Production preview served ${config.rewrites.length} direct application routes and the JavaScript bundle.`)
} finally {
  await new Promise((resolve, reject) => {
    server.httpServer.close((error) => (error ? reject(error) : resolve()))
  })
}
