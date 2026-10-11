export type RoadmapStatus = 'completed' | 'in-progress' | 'planned' | 'investigating'

export interface RoadmapItem {
  id: string
  title: string
  description: string
  category: 'Runtime' | 'Patches' | 'API' | 'Tooling' | 'Networking' | 'Docs'
  status: RoadmapStatus
  /**
   * A planning milestone, not a released version. Veltis has no `v0.x` release
   * history; releases are channel + Minecraft version + commit (for example
   * `Veltis 26.3 nightly 3077e84.jar`), so the roadmap deliberately does not
   * name version numbers that do not exist.
   */
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
    description: 'Git-based patch application and generation tooling for the decompiled vanilla server source.',
    category: 'Patches',
    status: 'completed',
    targetVersion: 'Foundation',
  },
  {
    id: 'modern-runtime-foundation',
    title: 'Modern Runtime Foundation (Java 25+)',
    description: 'Server runtime on a Java 25 baseline, using virtual threads for tick and task scheduling.',
    category: 'Runtime',
    status: 'completed',
    targetVersion: 'Foundation',
  },
  {
    id: 'build-toolchain',
    title: 'Automated CI/CD Build Toolchain',
    description: 'Gradle build pipeline and GitHub Actions release workflow that builds, verifies and publishes one distribution.',
    category: 'Tooling',
    status: 'completed',
    targetVersion: 'Foundation',
  },
  {
    id: 'parallel-tick-scheduler',
    title: 'Partitioned Parallel Tick Scheduler',
    description: 'Exploring partitioned entity and world tick scheduling while preserving game-state consistency.',
    category: 'Runtime',
    status: 'in-progress',
    targetVersion: 'Runtime Preview',
  },
  {
    id: 'native-api-contract',
    title: 'Veltis Extension API',
    description: 'Designing a capability-driven extension API. The `veltis-api` module is currently a placeholder with no published classes.',
    category: 'API',
    status: 'planned',
    targetVersion: 'Runtime Preview',
  },
  {
    id: 'memory-allocation-tuning',
    title: 'Network Buffer / Allocation Reduction',
    description: 'Investigating network buffer recycling and Netty pipeline tuning to reduce allocation pressure under load.',
    category: 'Networking',
    status: 'investigating',
    targetVersion: 'Runtime Preview',
  },
  {
    id: 'bukkit-bridge-layer',
    title: 'Bukkit / Paper Compatibility Bridge (Optional Subsystem)',
    description: 'Optional compatibility layer that could allow existing Spigot and Paper plugins to run on top of the Veltis runtime. Not implemented.',
    category: 'API',
    status: 'planned',
    targetVersion: 'Compatibility Layer',
  },
  {
    id: 'chunk-generation-concurrency',
    title: 'Concurrent World Generation & Noise Cache Acceleration',
    description: 'Off-thread terrain generation enhancements and native noise computation acceleration.',
    category: 'Runtime',
    status: 'planned',
    targetVersion: 'Compatibility Layer',
  },
  {
    id: 'interactive-flamegraph-profiler',
    title: 'Integrated Real-Time Tick Flamegraph Diagnostics',
    description: 'Low-overhead continuous profiling interface exposed through an authenticated administrative endpoint.',
    category: 'Tooling',
    status: 'investigating',
    targetVersion: 'Research',
  },
  {
    id: 'simd-chunk-compression',
    title: 'SIMD-Accelerated Chunk Packet & Region Compression',
    description: 'Investigating vector-accelerated compression for network traffic and region storage writing.',
    category: 'Networking',
    status: 'investigating',
    targetVersion: 'Research',
  },
]
