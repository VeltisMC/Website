import { Cpu } from 'lucide-react'
import ArchitectureDiagram from '../components/common/ArchitectureDiagram'
import Badge from '../components/common/Badge'

export default function ArchitecturePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="violet">ARCHITECTURE OVERVIEW</Badge>
          <Badge variant="emerald">DESIGN INTENT</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          System Architecture
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          How Veltis is put together: how it applies its patches to the decompiled vanilla server,
          which parts of the execution loop it changes today, and which changes are still design
          goals. Anything not yet shipped is labelled as such — nothing here is presented as
          delivered performance.
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
            What happens between launching the JVM and the server accepting connections. This is the
            bootstrap that exists today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <span className="text-xs font-mono text-violet-400 font-bold">01 / JVM BOOT</span>
            <h4 className="text-sm font-semibold text-white">Runtime Sanity Check</h4>
            <p className="text-xs text-slate-400">
              Confirms the Java 25+ runtime and assembles the module classpath before the server starts.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <span className="text-xs font-mono text-violet-400 font-bold">02 / PATCH MATRIX</span>
            <h4 className="text-sm font-semibold text-white">Shulker Workspace</h4>
            <p className="text-xs text-slate-400">
              Applies the Git patch set to the decompiled vanilla server source and verifies the resulting workspace.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <span className="text-xs font-mono text-violet-400 font-bold">03 / TASK ENGINE</span>
            <h4 className="text-sm font-semibold text-white">Tick &amp; Task Scheduling</h4>
            <p className="text-xs text-slate-400">
              Starts the game loop and task scheduler. Ancillary tasks run on virtual threads.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <span className="text-xs font-mono text-violet-400 font-bold">04 / WORLD LOAD</span>
            <h4 className="text-sm font-semibold text-white">World Engine</h4>
            <p className="text-xs text-slate-400">
              Loads dimensions through the region-based world engine and begins serving the network socket.
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
            Tick Execution and Threading
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            Veltis keeps a single authoritative game thread for world state. Entity ticking, block
            physics and redstone run in that thread, in order, as the game requires. Networking stays
            on Netty&apos;s own threads, and ancillary asynchronous tasks run on virtual threads
            instead of holding a platform thread each.
          </p>
        </div>

        <div className="p-5 rounded-lg border border-brand-border bg-[#0b0e17] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-violet-400" />
            <span>Where work runs today</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded bg-white/5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Inbound packet ingestion &amp; deserialization</span>
              <span className="text-emerald-400">Netty worker threads</span>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Entity ticks, block physics, redstone (in order)</span>
              <span className="text-sky-400">Main game thread</span>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Ancillary asynchronous tasks</span>
              <span className="text-emerald-400">Virtual threads</span>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-300">Outbound packet dispatch</span>
              <span className="text-emerald-400">Netty worker threads</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            Partitioning entity and pathfinding execution across worker pools is a roadmap item. It is
            not implemented in current builds and is not described here as if it were.
          </p>
        </div>
      </section>

      {/* 5. Network Pipeline */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            NETWORK PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Optional Off-Thread Compression
          </h2>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          Packet compression is CPU work that otherwise runs while holding up packet delivery. Veltis
          can hand that work to separate threads. The optimisation is opt-in and off by default; when
          it is off, compression behaves exactly as it does upstream.
        </p>

        <div className="p-5 rounded-lg border border-brand-border bg-brand-surface space-y-3 max-w-3xl">
          <h4 className="text-sm font-bold text-white">Status</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enabled through configuration, disabled by default. No comparative performance figures are
            published, because none have been benchmarked and reproduced.
          </p>
        </div>
      </section>
    </div>
  )
}
