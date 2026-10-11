import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cpu, GitBranch, Layers, Zap, Database, ArrowRight } from 'lucide-react'

interface NodeDetail {
  id: string
  title: string
  role: string
  description: string
  details: string[]
  badge: string
}

export default function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string>('core')

  const nodes: Record<string, NodeDetail> = {
    shulker: {
      id: 'shulker',
      title: 'Shulker Patch Pipeline',
      role: 'Upstream Source Ingestion & Patch Engine',
      description:
        'Takes the decompiled vanilla Minecraft server source, applies Veltis\u2019s Git patch set, and verifies the resulting workspace. Upstream files are never edited in place.',
      details: [
        'Git-based patch application to the decompiled server source',
        'Workspace verification after patching',
        'Upstream history is not modified in place',
      ],
      badge: 'Patch Toolchain',
    },
    core: {
      id: 'core',
      title: 'Veltis Core Runtime',
      role: 'Java 25 Runtime & World State',
      description:
        'The server a player connects to. It runs the game loop on a single authoritative thread and keeps world state consistent through the region-based world engine.',
      details: [
        'Java 25 runtime baseline',
        'Single authoritative game thread for world state',
        'Region-based world engine',
      ],
      badge: 'Core Runtime',
    },
    tick: {
      id: 'tick',
      title: 'Tick Engine',
      role: 'Single-Threaded Game Loop',
      description:
        'Entity ticks, block physics and redstone run in order on the main thread, as the game requires. Ancillary asynchronous tasks run on virtual threads.',
      details: [
        'Game loop runs on the main thread, in order',
        'Virtual threads for ancillary asynchronous tasks',
        'Partitioned parallel ticking is a roadmap item and is not shipped',
      ],
      badge: 'Game Loop',
    },
    io: {
      id: 'io',
      title: 'Networking & I/O',
      role: 'Netty & Optional Off-Thread Compression',
      description:
        'Networking runs on Netty worker threads. Veltis can additionally move packet compression off-thread; that optimisation is opt-in and disabled by default.',
      details: [
        'Netty worker threads for packet I/O',
        'Optional off-thread packet compression (default off)',
        'No SIMD or vector acceleration is claimed',
      ],
      badge: 'I/O & Networking',
    },
    api: {
      id: 'api',
      title: 'Extension API (Planned)',
      role: 'Not Yet Available',
      description:
        'The veltis-api module is currently a placeholder. No plugin API, lifecycle hooks or Bukkit compatibility layer exist in current builds; these are roadmap items.',
      details: [
        'veltis-api is an empty placeholder today',
        'No lifecycle hooks are implemented',
        'A Bukkit/Paper bridge is a roadmap item, not shipped',
      ],
      badge: 'Planned',
    },
  }

  const current = nodes[activeNode] || nodes.core

  return (
    <div className="rounded-xl border border-brand-border bg-brand-surface/80 p-6 backdrop-blur">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Visual Graph Area */}
        <div className="w-full lg:w-3/5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2 border-b border-white/5">
            <span>SYSTEM INTERCONNECTION MAP</span>
            <span className="text-violet-400">Click a component to inspect</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Shulker Node */}
            <button
              type="button"
              onClick={() => setActiveNode('shulker')}
              className={`p-4 rounded-lg text-left transition-all border ${
                activeNode === 'shulker'
                  ? 'border-violet-500 bg-violet-950/30 ring-1 ring-violet-500/50'
                  : 'border-brand-border bg-[#111420]/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-violet-500/10 text-violet-400">
                  <GitBranch className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  Toolchain
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">Shulker Patch Engine</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Applies Veltis&apos;s Git patch set to the decompiled vanilla server source.
              </p>
            </button>

            {/* Core Runtime Node */}
            <button
              type="button"
              onClick={() => setActiveNode('core')}
              className={`p-4 rounded-lg text-left transition-all border ${
                activeNode === 'core'
                  ? 'border-violet-500 bg-violet-950/30 ring-1 ring-violet-500/50'
                  : 'border-brand-border bg-[#111420]/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-violet-500/10 text-violet-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  Core Runtime
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">Veltis Core Runtime</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Java 25 runtime with a single authoritative game loop and region-based world state.
              </p>
            </button>

            {/* Tick Scheduler Node */}
            <button
              type="button"
              onClick={() => setActiveNode('tick')}
              className={`p-4 rounded-lg text-left transition-all border ${
                activeNode === 'tick'
                  ? 'border-violet-500 bg-violet-950/30 ring-1 ring-violet-500/50'
                  : 'border-brand-border bg-[#111420]/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-sky-500/10 text-sky-400">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  Game Loop
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">Tick Engine</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                In-order game loop on the main thread; virtual threads for async tasks.
              </p>
            </button>

            {/* Non-blocking IO Node */}
            <button
              type="button"
              onClick={() => setActiveNode('io')}
              className={`p-4 rounded-lg text-left transition-all border ${
                activeNode === 'io'
                  ? 'border-violet-500 bg-violet-950/30 ring-1 ring-violet-500/50'
                  : 'border-brand-border bg-[#111420]/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Networking
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">Networking &amp; I/O</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Netty packet I/O, with optional off-thread compression (off by default).
              </p>
            </button>

            {/* Native Plugin API Node */}
            <button
              type="button"
              onClick={() => setActiveNode('api')}
              className={`md:col-span-2 p-4 rounded-lg text-left transition-all border ${
                activeNode === 'api'
                  ? 'border-violet-500 bg-violet-950/30 ring-1 ring-violet-500/50'
                  : 'border-brand-border bg-[#111420]/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-violet-500/10 text-violet-400">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  Extensions
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">Extension API (Planned)</h4>
              <p className="text-xs text-slate-400 mt-1">
                The veltis-api module is a placeholder; no plugin API or Bukkit bridge ships today.
              </p>
            </button>
          </div>
        </div>

        {/* Selected Component Inspection Panel */}
        <div className="w-full lg:w-2/5 rounded-lg border border-brand-border bg-[#0b0d14] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold">
                {current.badge}
              </span>
              <span className="text-[11px] font-mono text-slate-500">ID: {current.id}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{current.title}</h3>
            <p className="text-xs font-medium text-slate-400 mb-3">{current.role}</p>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{current.description}</p>

            <div className="space-y-2 border-t border-white/5 pt-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Key Invariants:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {current.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-violet-400 font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <Link
              to="/architecture"
              className="inline-flex items-center text-xs font-medium text-violet-400 hover:text-violet-300 space-x-1.5"
            >
              <span>Read detailed architecture specification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
