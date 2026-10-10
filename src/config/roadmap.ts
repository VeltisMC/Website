export type RoadmapStatus = 'completed' | 'in-progress' | 'planned' | 'investigating'

export interface RoadmapItem {
  id: string
  title: string
  description: string
  category: 'Runtime' | 'Patches' | 'API' | 'Tooling' | 'Networking' | 'Docs'
  status: RoadmapStatus
  targetVersion?: string
  githubIssue?: string
  isDraftSample?: boolean
}

export const roadmapStatusMeta: Record<
  RoadmapStatus,
  { label: string; badgeClass: string; description: string }
> = {
  completed: {
    label: 'Completed',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Verified features, tools, and infrastructure delivered in current builds.',
  },
  'in-progress': {
    label: 'In Progress',
    badgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    description: 'Active design, patch development, and benchmarking underway.',
  },
  planned: {
    label: 'Planned',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    description: 'Scheduled implementation on the development roadmap for upcoming minor releases.',
  },
  investigating: {
    label: 'Under Investigation',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Research spikes, architectural feasibility studies, and experimental prototypes.',
  },
}

export const roadmapItems: RoadmapItem[] = [
  {
    id: 'shulker-patch-engine',
    title: 'Shulker Patch Engine Bootstrap',
    description: 'Core Git-based patch application and generation tooling for vanilla deobfuscated server source.',
    category: 'Patches',
    status: 'completed',
    targetVersion: 'v0.1.0-alpha',
  },
  {
    id: 'java-21-runtime',
    title: 'Java 21 Virtual Threads & Modern Runtime Foundation',
    description: 'Baseline server runtime targeting Java 21 LTS with modern vector API and concurrency support.',
    category: 'Runtime',
    status: 'completed',
    targetVersion: 'v0.1.0-alpha',
  },
  {
    id: 'build-toolchain',
    title: 'Automated CI/CD Build Toolchain & Shulker CLI',
    description: 'GitHub Actions workflow matrix for patch building, paperweight compatibility, and artifact packaging.',
    category: 'Tooling',
    status: 'completed',
    targetVersion: 'v0.1.0-alpha',
  },
  {
    id: 'parallel-tick-scheduler',
    title: 'Partitioned Parallel Tick Scheduler',
    description: 'Decoupled entity and world tick scheduling across worker pools while preserving game state consistency.',
    category: 'Runtime',
    status: 'in-progress',
    targetVersion: 'v0.2.0-beta',
  },
  {
    id: 'native-api-contract',
    title: 'Veltis Native Extension API (Preview)',
    description: 'Capability-driven plugin interfaces with explicit lifecycle contracts and async-safe event dispatcher.',
    category: 'API',
    status: 'in-progress',
    targetVersion: 'v0.2.0-beta',
  },
  {
    id: 'memory-allocation-tuning',
    title: 'Zero-Allocation Packet Serialization Pipeline',
    description: 'Optimized network buffer recycling and Netty pipeline tuning to reduce GC allocation pressure under heavy player loads.',
    category: 'Networking',
    status: 'in-progress',
    targetVersion: 'v0.2.0-beta',
  },
  {
    id: 'bukkit-bridge-layer',
    title: 'Bukkit / Paper Compatibility Bridge (Optional Subsystem)',
    description: 'Optional compatibility layer allowing existing Spigot and Paper plugins to run on top of the Veltis runtime.',
    category: 'API',
    status: 'planned',
    targetVersion: 'v0.3.0',
  },
  {
    id: 'chunk-generation-concurrency',
    title: 'Concurrent World Generation & Noise Cache Acceleration',
    description: 'Off-thread terrain generation enhancements and native noise computation acceleration.',
    category: 'Runtime',
    status: 'planned',
    targetVersion: 'v0.3.0',
  },
  {
    id: 'interactive-flamegraph-profiler',
    title: 'Integrated Real-Time Tick Flamegraph Diagnostics',
    description: 'Low-overhead continuous profiling interface directly exposed through an authenticated administrative endpoint.',
    category: 'Tooling',
    status: 'investigating',
    targetVersion: 'v0.4.0',
  },
  {
    id: 'simd-chunk-compression',
    title: 'SIMD-Accelerated Chunk Packet & Region Compression',
    description: 'Investigating Libdeflate and AVX2/NEON vector acceleration for network compression and region storage writing.',
    category: 'Networking',
    status: 'investigating',
    targetVersion: 'v0.4.0',
  },
]
