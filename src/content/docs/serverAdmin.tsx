import type { DocArticle } from '../../types/docs'
import CodeBlock from '../../components/common/CodeBlock'

export const serverAdminDocs: DocArticle[] = [
  {
    slug: 'startup-flags',
    title: 'Startup Arguments & GC Tuning',
    description: 'Optimal JVM startup flags for Veltis, including Generational ZGC and tuned G1GC configurations.',
    section: 'Server Administration',
    order: 1,
    headings: [
      { id: 'gc-selection', title: 'Choosing the Right Garbage Collector', level: 2 },
      { id: 'generational-zgc', title: 'Generational ZGC (Recommended for 12GB+)', level: 2 },
      { id: 'tuned-g1gc', title: 'Tuned G1GC (Best for 4GB - 12GB)', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          Garbage Collection (GC) pauses are the primary cause of latency spikes and dropped ticks in high-population Minecraft servers.
          Veltis is tuned to take full advantage of modern JVM garbage collectors available in Java 25+ / JDK 26.
        </p>

        <h2 id="gc-selection" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Choosing the Right Garbage Collector
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-brand-surface border border-white/10">
            <h3 className="text-base font-semibold text-white mb-1">Tuned G1GC</h3>
            <p className="text-xs text-slate-400 mb-2">Recommended for servers with 4GB to 12GB heap.</p>
            <p className="text-sm text-slate-300">
              High throughput with low pause duration targets. Excellent stability across all hardware architectures.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-brand-surface border border-violet-500/30">
            <h3 className="text-base font-semibold text-violet-400 mb-1">Generational ZGC</h3>
            <p className="text-xs text-slate-400 mb-2">Recommended for servers with 12GB+ heap & multi-core CPUs.</p>
            <p className="text-sm text-slate-300">
              Sub-millisecond pause times regardless of heap size. Eliminates micro-stutters during heavy player movement.
            </p>
          </div>
        </div>

        <h2 id="generational-zgc" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Generational ZGC (Java 25+)
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Generational ZGC reduces CPU overhead while maintaining sub-millisecond pauses:
        </p>
        <CodeBlock
          code={`java -Xms16G -Xmx16G \\
  -XX:+UseZGC \\
  -XX:+ZGenerational \\
  -XX:+AlwaysPreTouch \\
  -XX:+UseNUMA \\
  -jar veltis.jar --nogui`}
          language="bash"
        />

        <h2 id="tuned-g1gc" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Tuned G1GC Flags
        </h2>
        <p className="text-slate-300 leading-relaxed">
          For servers allocating 4GB to 12GB of RAM, our customized G1GC parameter set delivers high throughput:
        </p>
        <CodeBlock
          code={`java -Xms8G -Xmx8G \\
  -XX:+UseG1GC \\
  -XX:+ParallelRefProcEnabled \\
  -XX:MaxGCPauseMillis=200 \\
  -XX:+AlwaysPreTouch \\
  -XX:G1NewSizePercent=30 \\
  -XX:G1MaxNewSizePercent=40 \\
  -XX:G1ReservePercent=20 \\
  -XX:G1HeapRegionSize=8M \\
  -XX:G1MixedGCCountTarget=4 \\
  -jar veltis.jar --nogui`}
          language="bash"
        />
      </div>
    ),
  },
  {
    slug: 'performance-monitoring',
    title: 'Performance Monitoring & Profiling',
    description: 'Diagnosing tick performance and analyzing server latency.',
    section: 'Server Administration',
    order: 2,
    headings: [
      { id: 'spark-profiler', title: 'Using Spark Profiling', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          Observing tick times and worker thread utilization is critical for running demanding multiplayer servers.
        </p>

        <h2 id="spark-profiler" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Using Spark Profiling
        </h2>
        <p className="text-slate-300 leading-relaxed">
          To generate a sampling profile of server CPU time:
        </p>
        <CodeBlock
          code={`/spark sampler --timeout 300`}
          language="bash"
        />
        <p className="text-slate-300 text-sm">
          The resulting URL highlights exact call stacks consuming CPU time, making it easy to identify intensive world generation or mob AI routines.
        </p>
      </div>
    ),
  },
]
