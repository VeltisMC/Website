import type { DocArticle } from '../../types/docs'
import CodeBlock from '../../components/common/CodeBlock'

export const gettingStartedDocs: DocArticle[] = [
  {
    slug: 'introduction',
    title: 'Introduction to Veltis',
    description: 'An introduction to Veltis, a high-performance Minecraft server built directly with Minecraft server code.',
    section: 'Getting Started',
    order: 1,
    headings: [
      { id: 'what-is-veltis', title: 'What is Veltis?', level: 2 },
      { id: 'core-focus', title: 'What We Are Building', level: 2 },
      { id: 'not-bukkit', title: 'Direct Vanilla Foundation', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed text-lg">
          <strong>Veltis</strong> is a high-performance Minecraft server built around a simple idea:
          keep vanilla Minecraft at the center, and improve how it runs.
        </p>
        <p className="text-slate-300 leading-relaxed">
          It is not based on Bukkit, Spigot, or Paper. Veltis works directly with Minecraft&apos;s server code
          and adds its own runtime and world engine.
        </p>

        <h2 id="what-is-veltis" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          What is Veltis?
        </h2>
        <p className="text-slate-300 leading-relaxed">
          The goal of Veltis isn&apos;t to alter how Minecraft works or change gameplay mechanics.
          The goal is to make the server underneath it faster, more reliable, and better suited for modern hardware.
        </p>

        <h2 id="core-focus" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          What We Are Building
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li>
            <strong className="text-white">Multithreaded World Simulation:</strong> Region ownership and single-writer state coordination so independent world work can run across workers while conflicting world mutations remain ordered.
          </li>
          <li>
            <strong className="text-white">Better Use of Modern CPUs:</strong> Efficient multi-core scaling to eliminate single-thread bottlenecks.
          </li>
          <li>
            <strong className="text-white">Lower Server Overhead:</strong> Reduced memory footprint and CPU utilization for smoother server ticks.
          </li>
          <li>
            <strong className="text-white">Fast & Reliable Startup:</strong> Clean runtime initialization and deterministic startup.
          </li>
        </ul>

        <h2 id="not-bukkit" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Direct Vanilla Foundation
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Unlike traditional Minecraft server software that layers Bukkit/Spigot legacy abstraction layers on top of the server,
          Veltis is architected from the ground up directly around Minecraft deobfuscated server code.
        </p>
      </div>
    ),
  },
  {
    slug: 'prerequisites',
    title: 'Installation Prerequisites',
    description: 'Hardware requirements, JVM compatibility (Java 25+ / JDK 26), and environment setup for running Veltis.',
    section: 'Getting Started',
    order: 2,
    headings: [
      { id: 'system-requirements', title: 'System Requirements', level: 2 },
      { id: 'java-runtimes', title: 'Java 25+ / JDK 26 Runtime', level: 2 },
      { id: 'verifying-java', title: 'Verifying Java Installation', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          Before running or building Veltis, verify that your host environment meets the runtime prerequisites.
          Veltis targets modern 64-bit systems and requires <strong>Java 25+ (JDK 26 recommended)</strong>.
        </p>

        <h2 id="system-requirements" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          System Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-brand-surface border border-white/10">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Hardware</h3>
            <ul className="text-sm space-y-1.5 text-slate-300">
              <li>• <strong>CPU:</strong> 64-bit x86_64 or ARM64 multi-core processor</li>
              <li>• <strong>Memory:</strong> 4 GB RAM minimum (8 GB+ recommended)</li>
              <li>• <strong>Storage:</strong> Fast SSD / NVMe drive</li>
              <li>• <strong>OS:</strong> Linux, Windows Server, or macOS</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-brand-surface border border-violet-500/30">
            <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-2">Software</h3>
            <ul className="text-sm space-y-1.5 text-slate-300">
              <li>• <strong>Java:</strong> JDK 26 (or Java 25+)</li>
              <li>• <strong>Git:</strong> Required for building from source</li>
              <li>• <strong>Network:</strong> Internet connection for initial Minecraft file verification</li>
            </ul>
          </div>
        </div>

        <h2 id="java-runtimes" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Java 25+ / JDK 26 Runtime
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Veltis is compiled against modern Java features. Ensure you install a modern OpenJDK build (such as OpenJDK Early-Access or standard JDK 26).
        </p>

        <h2 id="verifying-java" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Verifying Java Installation
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Verify your Java version in your terminal:
        </p>
        <CodeBlock code={`java -version`} language="bash" />
      </div>
    ),
  },
  {
    slug: 'downloading-and-first-boot',
    title: 'Downloading & First Startup',
    description: 'Guide to acquiring Veltis, launching the server, and accepting the Mojang EULA.',
    section: 'Getting Started',
    order: 3,
    headings: [
      { id: 'acquiring-server', title: 'Acquiring Veltis', level: 2 },
      { id: 'launching-server', title: 'Launching the Server', level: 2 },
      { id: 'accepting-eula', title: 'Accepting the EULA', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          Getting a Veltis server running takes under two minutes.
        </p>

        <h2 id="acquiring-server" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Acquiring Veltis
        </h2>
        <p className="text-slate-300 leading-relaxed">
          You can download pre-built distributions from the <a href="/downloads" className="text-violet-400 hover:underline">Downloads page</a>, or build from source using <code>./gradlew buildVeltisMC</code>.
          Place <code>veltis.jar</code> into an empty directory dedicated to your Minecraft server.
        </p>

        <h2 id="launching-server" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Launching the Server
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Run the server distribution with:
        </p>
        <CodeBlock
          code={`java -jar veltis.jar --nogui`}
          language="bash"
        />
        <p className="text-xs text-slate-400">
          On first run, Veltis obtains the required Minecraft server files from Mojang, verifies them, prepares the Veltis runtime, and starts the server. (Minecraft itself is not redistributed with Veltis).
        </p>

        <h2 id="accepting-eula" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Accepting the EULA
        </h2>
        <p className="text-slate-300 leading-relaxed">
          On initial startup, an <code>eula.txt</code> file is generated. Open <code>eula.txt</code> and set:
        </p>
        <CodeBlock
          code={`eula=true`}
          language="properties"
          filename="eula.txt"
        />
        <p className="text-slate-300 leading-relaxed">
          Re-run <code>java -jar veltis.jar --nogui</code> to complete startup.
        </p>
      </div>
    ),
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting & FAQ',
    description: 'Diagnosing common startup crashes, port binding errors, and Java version mismatches.',
    section: 'Getting Started',
    order: 4,
    headings: [
      { id: 'java-version-error', title: 'Java Version Errors', level: 2 },
      { id: 'bind-exception', title: 'Address already in use (BindException)', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          Common startup issues and resolutions.
        </p>

        <h2 id="java-version-error" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          UnsupportedClassVersionError
        </h2>
        <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30 text-red-300 text-sm mb-3">
          <strong>Cause:</strong> You are attempting to run Veltis with an older Java version. Veltis requires Java 25+ / JDK 26.
        </div>
        <p className="text-slate-300">
          <strong>Solution:</strong> Install JDK 26 and ensure your <code>JAVA_HOME</code> or <code>PATH</code> references the JDK 26 binary.
        </p>

        <h2 id="bind-exception" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Address already in use (BindException)
        </h2>
        <p className="text-slate-300">
          <strong>Cause:</strong> Another server or process is already bound to port 25565.
        </p>
        <p className="text-slate-300">
          <strong>Solution:</strong> Stop the other process or adjust <code>server-port</code> in <code>server.properties</code>.
        </p>
      </div>
    ),
  },
]
