import type { DocArticle } from '../../types/docs'
import CodeBlock from '../../components/common/CodeBlock'

export const serverAdminDocs: DocArticle[] = [
  {
    slug: 'startup-flags',
    title: 'Startup Arguments & GC Options',
    description: 'JVM startup flags for Veltis, including Generational ZGC and G1GC. These are standard JVM options, not Veltis-specific tuning.',
    section: 'Server Administration',
    order: 1,
    headings: [
      { id: 'gc-selection', title: 'Choosing the Right Garbage Collector', level: 2 },
      { id: 'generational-zgc', title: 'Generational ZGC (Recommended for 12GB+)', level: 2 },
      { id: 'g1gc', title: 'G1GC (Best for 4GB - 12GB)', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          Garbage collection pauses are a common cause of latency spikes in busy Minecraft servers. Veltis runs on
          Java 25+ / JDK 26 and uses the JVM&apos;s own collectors; the flags below are standard JVM options that
          apply to any Java server, not a Veltis-specific tuning set.
        </p>

        <h2 id="gc-selection" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Choosing the Right Garbage Collector
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-brand-surface border border-white/10">
            <h3 className="text-base font-semibold text-white mb-1">G1GC</h3>
            <p className="text-xs text-slate-400 mb-2">Common choice for servers with 4GB to 12GB heap.</p>
            <p className="text-sm text-slate-300">
              A general-purpose collector with configurable pause targets, available on every platform.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-brand-surface border border-violet-500/30">
            <h3 className="text-base font-semibold text-violet-400 mb-1">Generational ZGC</h3>
            <p className="text-xs text-slate-400 mb-2">Recommended for servers with 12GB+ heap & multi-core CPUs.</p>
            <p className="text-sm text-slate-300">
              ZGC targets sub-millisecond pause times regardless of heap size, which can reduce GC pause
              spikes under heavy player movement.
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

        <h2 id="g1gc" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          G1GC Flags
        </h2>
        <p className="text-slate-300 leading-relaxed">
          For servers allocating 4GB to 12GB of RAM, this is a starting G1GC parameter set. Adjust it to your
          hardware:
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
    description: 'Diagnosing performance with standard JVM tooling.',
    section: 'Server Administration',
    order: 2,
    headings: [
      { id: 'jvm-profiling', title: 'Profiling with JVM Tooling', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          Veltis does not bundle a profiler and does not ship in-game performance commands. Profile the
          running process with the tooling that ships with the JDK.
        </p>

        <h2 id="jvm-profiling" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Profiling with JVM Tooling
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Java Flight Recorder is built into the JDK. Start a recording against the running server:
        </p>
        <CodeBlock
          code={`# <pid> is the server's process id
jcmd <pid> JFR.start duration=60s filename=veltis.jfr

# ...later, when the recording finishes
jcmd <pid> JFR.dump filename=veltis.jfr`}
          language="bash"
        />
        <p className="text-slate-300 text-sm">
          Open <code>veltis.jfr</code> in JDK Mission Control to inspect hot call stacks and allocation
          hot spots.
        </p>
      </div>
    ),
  },
]
