import { Cpu } from 'lucide-react'
import ArchitectureDiagram from '../components/common/ArchitectureDiagram'
import Badge from '../components/common/Badge'

export default function ArchitecturePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="violet">INTERNAL SPECIFICATION</Badge>
          <Badge variant="emerald">VERIFIED ARCHITECTURE</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          System Architecture
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          An in-depth analysis of the Veltis kernel: how we deconstruct the vanilla Minecraft execution
          loop, partition state across physical cores, and isolate memory allocation pipelines.
        </p>
      </div>

      {/* 2. System Topology Graph */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            TOPOLOGY & SCHEMATICS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            End-to-End Runtime Pipeline
          </h2>
        </div>

        <ArchitectureDiagram />
      </section>

      {/* 3. Server Initialization Pipeline */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
            BOOTSTRAP SEQUENCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Server Initialization & Bootstrap
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            From the initial invocation of <code>Main.main()</code> to the listening network socket,
            Veltis establishes memory arenas and worker pools before loading worlds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <span className="text-xs font-mono text-violet-400 font-bold">01 / JVM BOOT</span>
            <h4 className="text-sm font-semibold text-white">Runtime Sanity Check</h4>
            <p className="text-xs text-slate-400">
              Validates Java 21 LTS presence, initializes Vector API SIMD bindings, and checks huge-page support.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <span className="text-xs font-mono text-violet-400 font-bold">02 / PATCH MATRIX</span>
            <h4 className="text-sm font-semibold text-white">Shulker Verification</h4>
            <p className="text-xs text-slate-400">
              Verifies integrity checksums of applied bytecode patches. Emits the signature quote.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <span className="text-xs font-mono text-violet-400 font-bold">03 / WORKER POOL</span>
            <h4 className="text-sm font-semibold text-white">Scheduler ForkJoin</h4>
            <p className="text-xs text-slate-400">
              Allocates physical worker thread affinities and mounts Virtual Thread executors for disk I/O.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <span className="text-xs font-mono text-violet-400 font-bold">04 / WORLD LOAD</span>
            <h4 className="text-sm font-semibold text-white">Spatial Partitioning</h4>
            <p className="text-xs text-slate-400">
              Divides world dimensions into spatial sectors and starts asynchronous chunk cache preheating.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Concurrency Model */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            THREADING INVARIANTS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Partitioned Tick Concurrency Model
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            In vanilla Minecraft, entity tick execution, mob pathfinding, block physics, and networking are all
            intertwined into one monolithic thread loop. Veltis separates them into non-overlapping stages:
          </p>
        </div>

        <div className="p-5 rounded-lg border border-brand-border bg-[#0b0e17] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-violet-400" />
            <span>Tick Phase Synchronization Barrier</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded bg-white/5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Phase 1: Inbound Packet Ingestion & Deserialization</span>
              <span className="text-emerald-400">Off-Thread Netty Workers</span>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Phase 2: Entity Spatial Hashing & AI Pathfinding</span>
              <span className="text-violet-400">Partitioned ForkJoin Workers</span>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Phase 3: Synchronous State Harmonization & Redstone</span>
              <span className="text-sky-400">Main Game Thread</span>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Phase 4: Outbound Chunk & Entity Packet Dispatch</span>
              <span className="text-emerald-400">Off-Thread Virtual Threads</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Memory & Netty Buffer Allocation */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            ZERO-ALLOCATION PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Buffer Recycling & Garbage Collection
          </h2>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          Standard Minecraft servers allocate millions of temporary <code>byte[]</code> arrays per second when broadcasting
          chunk packets and entity movements. Under high player counts, this puts immense strain on the JVM garbage collector,
          leading to latency stutters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-lg border border-brand-border bg-brand-surface space-y-3">
            <h4 className="text-sm font-bold text-white">Vanilla / Legacy Model</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every chunk packet generates isolated byte arrays on the heap. When 50 players load chunks concurrently, the JVM
              experiences multi-gigabyte heap churn per minute, triggering frequent GC cycles.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-violet-500/30 bg-violet-950/15 space-y-3">
            <h4 className="text-sm font-bold text-violet-300">Veltis Off-Heap Recycling</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Veltis maintains pooled direct ByteBuf arenas outside the managed heap. Reusable network buffers are recycled
              upon socket transmission, dropping GC allocation pressure by up to 80%.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
