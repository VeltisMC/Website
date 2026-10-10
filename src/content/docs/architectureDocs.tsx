import type { DocArticle } from '../../types/docs'
import CodeBlock from '../../components/common/CodeBlock'

export const architectureDocs: DocArticle[] = [
  {
    slug: 'overview',
    title: 'Architecture Overview',
    description: 'Deconstructing the Veltis high-performance server runtime, scheduler partitions, and patch layer.',
    section: 'Architecture',
    order: 1,
    headings: [
      { id: 'runtime-subsystems', title: 'Subsystem Hierarchy', level: 2 },
      { id: 'tick-pipeline', title: 'The Partitioned Tick Pipeline', level: 2 },
      { id: 'memory-layout', title: 'Memory Architecture & Off-Heap Buffers', level: 2 },
      { id: 'safety-invariants', title: 'Concurrency Safety Invariants', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed text-lg">
          The classical Minecraft server model executes the entire world state sequentially on a single thread. Veltis
          replaces this paradigm with an architecture that decouples independent game systems, isolates I/O boundaries,
          and processes non-interfering entities concurrently.
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
|  Shulker Patch Engine |                     |  Native Plugin Runtime|
|  (Vanilla AST Layer)  |                     |  (Capability Model)   |
+-------+---------------+                     +-------+---------------+
        |                                             |
+-------v---------------------------------------------v-------+
|                 Parallel Tick Coordination Engine           |
|         - World Sub-tick Partitions                         |
|         - Entity Behavior Task Graph                        |
|         - Spatial Hashing & Collision Quadtree              |
+------------------------------+------------------------------+
                               |
        +----------------------+----------------------+
        |                                             |
+-------v---------------+                     +-------v---------------+
| Non-blocking Chunk IO |                     | Netty Buffer Recycling|
| (Virtual Threads)     |                     | (Zero-alloc Network)  |
+-----------------------+                     +-----------------------+`}
        </div>

        <h2 id="tick-pipeline" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          The Partitioned Tick Pipeline
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Each 50ms tick cycle in Veltis is structured into distinct phases with explicit synchronization barriers:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-slate-300">
          <li>
            <strong className="text-white">Network Ingestion:</strong> Inbound packets are deserialized off-thread into immutable event representations.
          </li>
          <li>
            <strong className="text-white">World Spatial Partitioning:</strong> Chunks are mapped into non-overlapping spatial domains.
          </li>
          <li>
            <strong className="text-white">Concurrent Entity Execution:</strong> Independent entity AI and movement calculations run in parallel worker pools.
          </li>
          <li>
            <strong className="text-white">Main-Thread State Harmonization:</strong> Inter-chunk block mutations, redstone propagations, and cross-entity interactions commit sequentially.
          </li>
          <li>
            <strong className="text-white">Asynchronous Flush:</strong> Chunk dirty pages and outbound packets are dispatched to background I/O threads.
          </li>
        </ol>

        <h2 id="memory-layout" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Memory Architecture & Off-Heap Buffers
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Veltis leverages direct byte buffer pools managed outside of the JVM garbage-collected heap for network packet serialization.
          This prevents multi-megabyte heap churn caused by high-rate chunk packet emissions to dozens of connected players simultaneously.
        </p>
      </div>
    ),
  },
  {
    slug: 'concurrency-model',
    title: 'Concurrency Model & Safety',
    description: 'Deep dive into thread boundaries, spatial partitioning, and lock-free data structures in Veltis.',
    section: 'Architecture',
    order: 2,
    headings: [
      { id: 'spatial-partitioning', title: 'Spatial Chunk Partitioning', level: 2 },
      { id: 'lock-free-structures', title: 'Lock-Free Entity Tracking', level: 2 },
      { id: 'virtual-threads', title: 'Virtual Threads for Chunk I/O', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          Concurrent execution in a game server is only viable if state mutations are mathematically isolated to prevent race conditions.
          Veltis achieves this through spatial chunk partitioning.
        </p>

        <h2 id="spatial-partitioning" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Spatial Chunk Partitioning
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Worlds are divided into a 2D grid of sectors. Entities contained strictly within non-adjacent sectors can execute their
          pathfinding, physics, and goal evaluators in parallel without lock contention.
        </p>
        <CodeBlock
          code={`// Conceptual Partition Barrier (Veltis Kernel)
SectorPartition partitionA = world.getPartition(0, 0);
SectorPartition partitionB = world.getPartition(2, 2);

// Executes safely on distinct worker threads
workerPool.execute(() -> partitionA.tickEntities());
workerPool.execute(() -> partitionB.tickEntities());`}
          language="java"
        />

        <h2 id="virtual-threads" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Virtual Threads for Chunk I/O
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Rather than blocking dedicated OS threads when reading chunk region files from disk, Veltis uses Java 21 Project Loom
          Virtual Threads. When a region file read blocks on storage I/O, the virtual thread unmounts from its carrier thread,
          freeing CPU cores for continuous tick computation.
        </p>
      </div>
    ),
  },
]
