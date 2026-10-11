import type { DocArticle } from '../../types/docs'

export const architectureDocs: DocArticle[] = [
  {
    slug: 'overview',
    title: 'Architecture Overview',
    description: 'How the Veltis server runtime is assembled from the decompiled vanilla server and the Shulker patch set.',
    section: 'Architecture',
    order: 1,
    headings: [
      { id: 'runtime-subsystems', title: 'Subsystem Hierarchy', level: 2 },
      { id: 'tick-pipeline', title: 'The Game Loop', level: 2 },
      { id: 'memory-layout', title: 'Memory & Buffers', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed text-lg">
          Veltis is the decompiled vanilla Minecraft server with a reviewed set of patches applied on
          top. It keeps a single authoritative game thread for world state, and changes only what the
          patch set changes — not the whole execution model.
        </p>

        <h2 id="runtime-subsystems" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Subsystem Hierarchy
        </h2>
        <div className="p-4 bg-brand-surface rounded-lg border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          {`+-------------------------------------------------------------+
|                     Veltis Server Application               |
+-------------------------------------------------------------+
                               |
        +----------------------+----------------------+
        |                                             |
+-------v---------------+                     +-------v---------------+
|  Shulker Patch Engine |                     |   veltis-api module   |
|  (Git patch set)      |                     |   (placeholder)       |
+-------+---------------+                     +-------+---------------+
        |                                             |
+-------v---------------------------------------------v-------+
|             Patched vanilla server runtime                  |
|         - Single authoritative game thread                  |
|         - Region-based world engine                         |
|         - Netty networking                                  |
+------------------------------+------------------------------+
                               |
        +----------------------+----------------------+
        |                                             |
+-------v---------------+                     +-------v---------------+
| Ancillary async tasks |                     | Netty packet I/O      |
| (virtual threads)     |                     | (worker threads)      |
+-----------------------+                     +-----------------------+`}
        </div>
        <p className="text-xs text-slate-500">
          <code>veltis-api</code> is an empty boundary module today; no plugin API ships.
        </p>

        <h2 id="tick-pipeline" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          The Game Loop
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Entity ticking, block physics and redstone run in order on the main thread, as the game
          requires. Around that loop:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li>
            <strong className="text-white">Networking</strong> runs on Netty worker threads.
          </li>
          <li>
            <strong className="text-white">Ancillary asynchronous tasks</strong> run on virtual
            threads rather than occupying a platform thread each.
          </li>
          <li>
            <strong className="text-white">Off-thread packet compression</strong> is an optional
            optimisation, disabled by default.
          </li>
        </ul>
        <p className="text-slate-400 text-sm leading-relaxed">
          Partitioning entity and pathfinding execution across worker pools is a roadmap item. It is
          not implemented in current builds.
        </p>

        <h2 id="memory-layout" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Memory &amp; Buffers
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Veltis does not publish memory or allocation figures, because none have been benchmarked and
          reproduced. The patch set includes targeted allocation reductions (for example caching
          static collision shapes), and each is described by its patch rather than by a headline
          number.
        </p>
      </div>
    ),
  },
  {
    slug: 'concurrency-model',
    title: 'Concurrency Model & Safety',
    description: 'The thread boundaries Veltis actually enforces, and what is still on the roadmap.',
    section: 'Architecture',
    order: 2,
    headings: [
      { id: 'thread-boundaries', title: 'Thread Boundaries', level: 2 },
      { id: 'world-engine', title: 'Region-Based World Engine', level: 2 },
      { id: 'virtual-threads', title: 'Virtual Threads', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          Concurrency in a game server is only safe if state mutations are isolated. Veltis takes the
          conservative route: world state has a single writer.
        </p>

        <h2 id="thread-boundaries" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Thread Boundaries
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li>
            <strong className="text-white">Main game thread:</strong> owns world state; runs entity
            ticks, block physics and redstone in order.
          </li>
          <li>
            <strong className="text-white">Netty worker threads:</strong> decode inbound packets and
            encode outbound packets.
          </li>
          <li>
            <strong className="text-white">Virtual threads:</strong> run ancillary asynchronous tasks.
          </li>
        </ul>

        <h2 id="world-engine" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Region-Based World Engine
        </h2>
        <p className="text-slate-300 leading-relaxed">
          The world engine is organised around regions rather than a lock-free grid of parallel tick
          partitions. Independent entity execution across spatial worker pools is a roadmap item, not
          a shipped feature.
        </p>

        <h2 id="virtual-threads" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Virtual Threads
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Veltis runs on Java 25 and uses virtual threads for ancillary asynchronous work. This keeps
          task scheduling from consuming a platform thread per task; it is not a claim that the game
          loop itself is parallel.
        </p>
      </div>
    ),
  },
]
