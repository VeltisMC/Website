# VeltisMC Official Website

Official website and developer portal for **Veltis**, the optimization-focused Minecraft server software developed by the VeltisMC organization.

> _"Lift the code. Drop the optimization."_

---

## Features

- **Developer-Centric Visual Identity:** Deep charcoal/near-black theme with electric violet accents, geometric typography, and zero SaaS fluff.
- **PaperMC-Inspired Downloads:** Compact build browser with Minecraft version tabs, Stable/Beta/Nightly channel toggle, direct JAR downloads, and SHA-256 copy action.
- **Release Metadata Sync:** A `veltis-release` repository event from `VeltisMC/Veltis` writes the published build into `public/releases/<channel>.json`; the download page reads that first, falls back to the GitHub releases API, and never fabricates a build when neither is available.
- **Searchable Documentation:** Complete multi-section documentation covering Getting Started, Server Administration, System Architecture, and Migration.
- **Global Command Palette (`Ctrl+K` / `⌘K`):** Instant client-side search across documentation articles, subheadings, and site pages.
- **Developer Portal:** Proposed native capability-based plugin API specification, multithreading guidelines, and Gradle/Maven setup examples.
- **Architecture & Shulker Deep-Dive:** Interactive SVG system topology map and comprehensive guide to the Shulker patch engine.
- **Roadmap & Community Hub:** Filterable milestone board, contribution instructions, changelog timeline, and GPL-3.0 license statement.
- **Vercel-Ready Deployment:** Client-side SPA routing (`vercel.json`), semantic markup, Open Graph tags, `robots.txt`, and `sitemap.xml`.

---

## Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React
- **Routing:** React Router DOM v7
- **Code Highlighting:** Prism React Renderer

---

## Release Metadata Sync

The server repository builds and publishes each release, then sends this site a
`veltis-release` repository event. `.github/workflows/sync-release.yml` validates
the payload, writes `public/releases/<channel>.json` (latest build plus capped
history for that channel only), and commits. Vercel redeploys on the push.

At read time the download page prefers those files, falls back to the GitHub
releases API, and finally shows an honest "no published releases" state. It never
invents a version, a filename, or a download URL.

### Required setup

- The server repository must be granted a token that can send `repository_dispatch`
  to this repository (`contents: write`). This workflow writes with the
  repository's own `GITHUB_TOKEN`; only the sender needs a secret.
- No repository files under `public/releases/` should be edited by hand.

---

## Local Development

Ensure you have Node.js 20+ installed.

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Build & Verification

```bash
# Type check and build production bundle
npm run build

# Run linter
npm run lint

# Preview the production build locally
npm run preview
```

---

## Deployment to Vercel

This repository is pre-configured for seamless deployment to **Vercel**:

1. Import the repository on [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Deploy! Client-side routing is handled via `vercel.json`.

---

## Repository & Branding Configuration

Site metadata, external links, and version defaults are centrally maintained in `src/config/site.ts`:

```typescript
export const siteConfig = {
  name: 'Veltis',
  url: 'https://www.veltismc.org',
  github: 'https://github.com/VeltisMC/Veltis',
  discord: 'https://discord.com/invite/239MkjVmZw',
  defaultMinecraftVersion: '26.3',
  javaRequirement: 'Java 25+ (JDK 26)',
  ...
}
```

---

## License

Licensed under the **GNU General Public License v3.0 (GPL-3.0)**.
