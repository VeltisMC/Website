import { Terminal } from 'lucide-react'
import CodeBlock from '../components/common/CodeBlock'
import Badge from '../components/common/Badge'

export default function ShulkerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="violet">PATCH MANAGEMENT ENGINE</Badge>
          <Badge variant="cyan">DEV TOOLCHAIN</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Shulker Patch Engine
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          The automated Git-based patching infrastructure that drives Veltis development. Shulker allows us
          to apply atomic, reviewable performance modifications to vanilla Minecraft without maintaining
          a massive, unmaintainable hard fork.
        </p>
      </div>

      {/* 2. Signature Quote Banner */}
      <div className="p-6 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-[#101322] to-violet-950/20 shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-violet-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-violet-300 font-semibold">
            Signature Server Log Quote
          </span>
        </div>
        <div className="font-mono text-lg sm:text-xl text-white font-bold tracking-tight bg-black/40 p-4 rounded-lg border border-white/5">
          [Veltis] Vanilla lifted. Veltis dropped.
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          <em>Note:</em> This iconic startup message is a playful nod to lifting upstream vanilla deobfuscated bytecode
          and cleanly dropping in our optimization patches—not a literal description of every atomic Git commit!
        </p>
      </div>

      {/* 3. Why Veltis Uses Patches */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            PHILOSOPHY & RATIONALE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Why Use a Patch-Based Workflow?
          </h2>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
          Maintaining a fork of proprietary or frequently updating upstream software like Minecraft is notoriously difficult.
          Directly editing source trees leads to git merge conflicts and messy rebases whenever Mojang drops a minor version.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h3 className="font-bold text-white text-base">Atomic Commits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every optimization or bug fix exists as an isolated Git patch file. If a specific patch has an edge case,
              it can be reverted without affecting other subsystems.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h3 className="font-bold text-white text-base">Rapid Version Bumps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When Minecraft 1.21.5 or 1.22 releases, Shulker automatically rebases our patch stack on top of Mojang&apos;s
              new deobfuscated mapping bundle in minutes.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h3 className="font-bold text-white text-base">Clear Upstream Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contributors and server operators can inspect every single line of code modified relative to vanilla Minecraft.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Directory Organization */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
            REPOSITORY STRUCTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How Patches Are Organized
          </h2>
          <p className="text-slate-400 text-sm">
            In the Veltis repository, patches are split cleanly between public APIs and server internals:
          </p>
        </div>

        <div className="p-5 rounded-lg border border-brand-border bg-[#0d101a] font-mono text-xs text-slate-300 space-y-2">
          <div>📁 <strong>Veltis/</strong></div>
          <div className="pl-4">├── 📁 <strong>patches/</strong></div>
          <div className="pl-8">├── 📁 <strong>api/</strong> <span className="text-slate-500"># Patches applied to Veltis API interfaces</span></div>
          <div className="pl-12">│   ├── 0001-Add-Veltis-Extension-Context-Interface.patch</div>
          <div className="pl-12">│   └── 0002-Introduce-Asynchronous-Event-Subscription.patch</div>
          <div className="pl-8">└── 📁 <strong>server/</strong> <span className="text-slate-500"># Core server engine optimizations</span></div>
          <div className="pl-12">    ├── 0001-Veltis-Runtime-Bootstrap-and-Branding.patch</div>
          <div className="pl-12">    ├── 0002-Partitioned-Entity-Tick-Scheduler.patch</div>
          <div className="pl-12">    ├── 0003-SIMD-Vectorized-Bounding-Box-Distance.patch</div>
          <div className="pl-12">    └── 0004-Recycle-Netty-ByteBuf-Allocations.patch</div>
        </div>
      </section>

      {/* 5. Contributor Workflow */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            DEVELOPMENT PROCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Working with Shulker Patches
          </h2>
          <p className="text-slate-400 text-sm">
            Contributors work in subprojects and rebuild patch files using simple Gradle tasks:
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white">1. Decompile & Apply Existing Patches</h4>
          <CodeBlock
            language="bash"
            code={`# Clones vanilla dependencies, applies mappings, and applies git patches
./gradlew applyPatches`}
          />

          <h4 className="text-sm font-semibold text-white">2. Modify Code & Commit to the Submodule</h4>
          <p className="text-xs text-slate-400">
            Navigate to <code>Veltis-Server/</code> or <code>Veltis-API/</code>, write your optimization or fix, and make a standard Git commit.
          </p>

          <h4 className="text-sm font-semibold text-white">3. Rebuild Patches Back into the Repository</h4>
          <CodeBlock
            language="bash"
            code={`# Exports your Git commits into serialized .patch files in patches/
./gradlew rebuildPatches`}
          />

          <h4 className="text-sm font-semibold text-white">4. Compile & Test the Server</h4>
          <CodeBlock
            language="bash"
            code={`# Builds the executable server JAR artifact in build/libs/
./gradlew build`}
          />
        </div>
      </section>

      {/* 6. Handling Conflicts */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            MAINTENANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Patch Conflict Resolution
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            When upstream changes conflict with an existing patch, Shulker pauses the rebase and leaves standard Git conflict markers
            (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>). Resolve the conflict, run <code>git add .</code>, and type <code>git am --continue</code>.
            Once complete, running <code>./gradlew rebuildPatches</code> updates the patch files cleanly.
          </p>
        </div>
      </section>
    </div>
  )
}
