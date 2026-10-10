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
      role: 'Upstream Code Ingestion & AST Patch Engine',
      description:
        'Lifts vanilla Minecraft deobfuscated sources, validates symbol mappings, and applies clean, atomic Git patches without dirtying upstream history.',
      details: [
        'Automated 3-way AST rebasing across Mojang releases',
        'Separation of patches/server and patches/api',
        'Strict zero-drift policy against vanilla protocol contracts',
      ],
      badge: 'Patch Toolchain',
    },
    core: {
      id: 'core',
      title: 'Veltis Core Runtime',
      role: 'Java 21 Engine & State Coordinator',
      description:
        'The heartbeat of the server. Orchestrates partitioned tick execution, harmonizes state commits, and manages memory lifetimes.',
      details: [
        'Targeted Java 21 LTS baseline with Generational ZGC support',
        'Direct ByteBuf off-heap memory management',
        'Lock-free spatial state barriers across chunk domains',
      ],
      badge: 'Kernel Engine',
    },
    tick: {
      id: 'tick',
      title: 'Parallel Tick Scheduler',
      role: 'Multi-Core Worker Dispatcher',
      description:
        'Splits entity AI, pathfinding, and physics across dedicated worker pools, keeping main-thread tick durations well within the 50ms budget.',
      details: [
        'Quadtree spatial entity partitioning',
        'Work-stealing thread pools balanced across physical CPU cores',
        'Deterministic state reconciliation at tick boundaries',
      ],
      badge: 'Concurrency Layer',
    },
    io: {
      id: 'io',
      title: 'Non-blocking I/O & Network',
      role: 'Virtual Thread Storage & SIMD Netty',
      description:
        'Eliminates synchronous disk stalls by running chunk region file deserialization on Java 21 Virtual Threads and compressing packets with Libdeflate.',
      details: [
        'Java 21 Project Loom virtual threads for async chunk I/O',
        'Zero-allocation Netty buffer recycling',
        'AVX-512 / NEON hardware vector acceleration',
      ],
      badge: 'I/O & Networking',
    },
    api: {
      id: 'api',
      title: 'Native Capability API',
      role: 'Extension Contract & Concurrency Boundaries',
      description:
        'Clean, capability-oriented plugin framework that enforces safe off-thread computation while providing full access to world and entity context.',
      details: [
        'Explicit lifecycle hooks: onInitialize, onEnable, onDisable',
        'Safe task scheduling distinguished by CPU vs. state access',
        'Optional compatibility bridge for legacy Bukkit/Paper plugins',
      ],
      badge: 'Developer Portal',
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
                Lifts vanilla deobfuscated bytecode and injects optimization patches cleanly.
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
                Java 21 LTS foundation, state synchronization, and low-latency GC tuning.
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
                  Parallelism
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">Parallel Tick Scheduler</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Spatial entity partitioning across multi-core worker pools.
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
                  Storage & Net
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">Non-blocking I/O & Net</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Virtual Threads for disk access and zero-allocation network pipelines.
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
              <h4 className="text-sm font-semibold text-white">Native Capability API & Bukkit Bridge</h4>
              <p className="text-xs text-slate-400 mt-1">
                Capability-based plugin boundaries designed for safe concurrency, with optional legacy Bukkit compatibility.
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
