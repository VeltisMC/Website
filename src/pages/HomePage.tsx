import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Download,
  ArrowRight,
  Zap,
  Cpu,
  Layers,
  Shield,
  Activity,
  BookOpen,
} from 'lucide-react'
import { siteConfig } from '../config/site'
import Badge from '../components/common/Badge'
import DiscordIcon from '../components/common/DiscordIcon'
import GithubIcon from '../components/common/GithubIcon'
import { fetchReleases } from '../services/github'
import type { BuildInfo } from '../types/release'

export default function HomePage() {
  const [latestBuild, setLatestBuild] = useState<BuildInfo | null>(null)

  useEffect(() => {
    fetchReleases().then((res) => {
      const verObj = res.versions[siteConfig.defaultMinecraftVersion]
      if (verObj && verObj.latestRelease) {
        setLatestBuild(verObj.latestRelease)
      } else if (verObj && verObj.builds.length > 0) {
        setLatestBuild(verObj.builds[0])
      }
    })
  }, [])

  return (
    <div className="space-y-24 py-12 sm:py-20">
      {/* 1. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8 relative z-10">
          {/* Top Status Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/20 text-xs font-mono text-violet-300">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            <span>Minecraft {siteConfig.defaultMinecraftVersion} &bull; Java 25+ Runtime</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
            Minecraft server software.{' '}
            <span className="bg-gradient-to-r from-violet-400 via-violet-200 to-sky-400 bg-clip-text text-transparent">
              Re-engineered.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed font-normal">
            {siteConfig.description}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              to="/downloads"
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-base shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Download className="w-5 h-5" />
              <span>Download Veltis</span>
            </Link>

            <Link
              to="/docs"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg border border-brand-border bg-brand-surface hover:bg-white/5 text-slate-300 hover:text-white font-medium text-base transition-colors"
            >
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span>Read Documentation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Feature Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            ENGINE PRINCIPLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            What We&apos;re Building
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            The goal isn&apos;t to change how Minecraft works. The goal is to make the server underneath it better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-xl border border-brand-border bg-brand-surface hover:border-violet-500/40 transition-all space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-violet-500/10 text-violet-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Single-Writer World State</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A single authoritative game thread owns world state, so conflicting mutations are always ordered. Partitioned parallel ticking is a roadmap item, not a shipped feature.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl border border-brand-border bg-brand-surface hover:border-violet-500/40 transition-all space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-sky-500/10 text-sky-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Direct Vanilla Foundation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Not based on Bukkit, Spigot, or Paper. Veltis works directly with Minecraft&apos;s server code and adds its own runtime and world engine.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl border border-brand-border bg-brand-surface hover:border-violet-500/40 transition-all space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Modern Runtime</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Runs on Java 25 with virtual threads for ancillary asynchronous work, so background tasks do not each hold a platform thread.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-xl border border-brand-border bg-brand-surface hover:border-violet-500/40 transition-all space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Modern Java 25+</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Runs on Java 25 and up, using the runtime&apos;s own memory management and virtual-thread support.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-xl border border-brand-border bg-brand-surface hover:border-violet-500/40 transition-all space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-violet-500/10 text-violet-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Clean Development Workflow</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Changes are maintained through a structured source patch system kept in Git, keeping modifications reviewable, reproducible, and separate.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-xl border border-brand-border bg-brand-surface hover:border-violet-500/40 transition-all space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Open Source (GPL-3.0)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Veltis is completely free, transparent, and licensed under the GNU General Public License v3.0 by the VeltisMC organization.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Release Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-xl border border-brand-border bg-[#0e111a] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase text-violet-400 font-semibold">
                CURRENT DEVELOPMENT BUILD
              </span>
              <Badge variant="emerald">ACTIVE</Badge>
            </div>
            <h3 className="text-2xl font-bold text-white font-mono">
              Veltis {latestBuild ? `${latestBuild.minecraftVersion} ${latestBuild.commitHash}` : `Minecraft ${siteConfig.defaultMinecraftVersion}`}
            </h3>
            <p className="text-xs text-slate-400 max-w-lg font-mono">
              {latestBuild ? latestBuild.commitMessage : 'Direct vanilla Minecraft server runtime with multithreaded world engine.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/downloads"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-md shadow-violet-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Builds</span>
            </Link>

            <Link
              to="/changelog"
              className="w-full sm:w-auto flex items-center justify-center space-x-1 px-4 py-2.5 rounded-lg border border-brand-border hover:bg-white/5 text-slate-300 text-xs font-mono"
            >
              <span>Changelog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Community Callout */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-brand-border bg-gradient-to-br from-[#121626] to-[#090b12] p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Join the Veltis Community
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Connect with our team, follow active server development, and get assistance on our official Discord server.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href={siteConfig.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-medium transition-colors shadow-lg shadow-[#5865F2]/20"
            >
              <DiscordIcon className="w-4 h-4" />
              <span>Join Discord</span>
            </a>

            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-brand-border bg-brand-surface hover:bg-white/5 text-slate-200 text-sm font-medium transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>

            <Link
              to="/contributing"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-violet-500/30 bg-violet-950/20 text-violet-300 hover:bg-violet-900/30 text-sm font-medium transition-colors"
            >
              <span>Contribution Guidelines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
