import CodeBlock from '../components/common/CodeBlock'
import Badge from '../components/common/Badge'

export default function ContributingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="emerald">OPEN SOURCE INVOLVEMENT</Badge>
          <Badge variant="violet">SHULKER TOOLCHAIN</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contributing to Veltis
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          Thank you for helping optimize Minecraft server architecture. This guide covers repository
          setup, coding conventions, patch rebuild workflows, and our Pull Request review process.
        </p>
      </div>

      {/* 2. Prerequisites & Environment */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            ENVIRONMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Development Environment Setup
          </h2>
        </div>

        <ul className="list-disc pl-6 space-y-2 text-slate-300 text-sm">
          <li>
            <strong className="text-white">JDK 26 (Java 25+):</strong> Eclipse Temurin or GraalVM JDK 26 configured in your environment.
          </li>
          <li>
            <strong className="text-white">Git 2.30+:</strong> Required for applying and rebuilding the Shulker patch set.
          </li>
          <li>
            <strong className="text-white">IDE:</strong> IntelliJ IDEA (recommended with the Minecraft Development plugin) or Eclipse.
          </li>
        </ul>

        <h3 className="text-lg font-bold text-white pt-4">Cloning & Building</h3>
        <CodeBlock
          language="bash"
          code={`# 1. Clone the Veltis repository
git clone https://github.com/VeltisMC/Veltis.git
cd Veltis

# 2. Decompile and apply the Shulker patch set
./gradlew applyPatches

# 3. Compile the complete project and run unit tests
./gradlew build`}
        />
      </section>

      {/* 3. Patch Contribution Process */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
            PATCH WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Writing & Submitting Patches
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            All changes to the decompiled server are stored as Git patch files in <code>server/Shulker/code/</code>.
          </p>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h4 className="font-semibold text-white">Step 1: Create a Feature Branch</h4>
            <p className="text-xs text-slate-400">
              Always branch from <code>main</code> before modifying code:
            </p>
            <CodeBlock language="bash" code={`git checkout -b feat/reduce-entity-lookup-cost`} />
          </div>

          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h4 className="font-semibold text-white">Step 2: Commit Inside the Applied Working Tree</h4>
            <p className="text-xs text-slate-400">
              After <code>./gradlew applyPatches</code>, edit the sources under <code>minecraft/workspace/</code> and commit
              them with Git:
            </p>
            <CodeBlock
              language="bash"
              code={`# the applied sources live under minecraft/workspace/<version>/patched
git commit -am "Reduce entity lookup cost"`}
            />
          </div>

          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h4 className="font-semibold text-white">Step 3: Rebuild Patch Files</h4>
            <p className="text-xs text-slate-400">
              From the repository root, run Shulker&apos;s patch generator:
            </p>
            <CodeBlock language="bash" code={`./gradlew rebuildPatches`} />
          </div>

          <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h4 className="font-semibold text-white">Step 4: Commit the New Patch to Git</h4>
            <p className="text-xs text-slate-400">
              Stage the newly generated <code>.patch</code> file and submit your Pull Request to the main repository.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Code Standards */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            STYLE & QUALITY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Code Conventions & Benchmarking
          </h2>
        </div>

        <ul className="list-disc pl-6 space-y-2 text-slate-300 text-sm">
          <li>
            <strong className="text-white">Clean Comments & Licensing:</strong> Preserve all upstream copyright comments and docstrings.
          </li>
          <li>
            <strong className="text-white">Microbenchmarks (JMH):</strong> For performance-sensitive PRs, include a JMH benchmark or a JFR recording demonstrating measurable latency reduction.
          </li>
          <li>
            <strong className="text-white">Threads:</strong> Avoid creating unbound threads; use the scheduler facilities already present in the codebase.
          </li>
        </ul>
      </section>
    </div>
  )
}
