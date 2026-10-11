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
          The Git-based patching infrastructure that drives Veltis development. Shulker applies
          reviewable modifications to the decompiled vanilla Minecraft server, so Veltis does not
          have to maintain a large hand-edited fork.
        </p>
      </div>

      {/* 2. At a glance */}
      <div className="p-6 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-[#101322] to-violet-950/20 shadow-xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-violet-300 font-semibold">
          At a glance
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Modules</p>
            <p className="text-slate-200 font-mono text-xs">
              veltis-api &middot; launcher &middot; patch-engine &middot; server
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Gradle tasks</p>
            <p className="text-slate-200 font-mono text-xs">
              applyPatches &middot; rebuildPatches &middot; buildVeltisMC &middot; benchmark
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Patch files live in <code>server/Shulker/code/</code>. <code>veltis-api</code> is a
          boundary that currently holds no classes; the server and runtime code live in{' '}
          <code>server</code> and <code>patch-engine</code>.
        </p>
      </div>

      {/* 3. Why Veltis Uses Patches */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            PHILOSOPHY &amp; RATIONALE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Why Use a Patch-Based Workflow?
          </h2>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
          Maintaining a fork of a frequently updating upstream is difficult. Directly editing a
          checked-in source tree leads to merge conflicts and messy rebases whenever the upstream
          version changes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h3 className="font-bold text-white text-base">Isolated Changes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each change exists as its own Git patch file. If one patch has an edge case, it can be
              reverted without touching the others.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h3 className="font-bold text-white text-base">Re-base on New Versions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When Mojang ships a new Minecraft version, the patch set is re-applied to the newly
              decompiled sources. Conflicts surface as ordinary Git conflicts to resolve.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-brand-border bg-brand-surface space-y-2">
            <h3 className="font-bold text-white text-base">Readable Upstream Diff</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every change Veltis makes to vanilla is visible as a patch against the decompiled
              source.
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
            The patches applied to the decompiled server source, in application order:
          </p>
        </div>

        <div className="p-5 rounded-lg border border-brand-border bg-[#0d101a] font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
          <div>server/</div>
          <div className="pl-4">└── Shulker/</div>
          <div className="pl-8">└── code/</div>
          <div className="pl-12">├── 001-Improve-Command-Logging.patch</div>
          <div className="pl-12">├── 002-Improve-DedicatedServer-Logging.patch</div>
          <div className="pl-12">├── 003-Improve-PlayerList-Logging.patch</div>
          <div className="pl-12">├── 004-Wire-VeltisBootstrap-Integration.patch</div>
          <div className="pl-12">├── 005-Wire-VeltisBootstrap-Shutdown.patch</div>
          <div className="pl-12">├── 006-Fix-Decompiled-PermissionLevel-Switch.patch</div>
          <div className="pl-12">├── 007-Report-Total-Startup-Time.patch</div>
          <div className="pl-12">├── 008-Fix-Decompiled-Hopper-GetEntities-Type-Witness.patch</div>
          <div className="pl-12">├── 009-Hopper-Item-Lookup.patch</div>
          <div className="pl-12">├── 010-Skip-Hopper-Search-When-Blocked.patch</div>
          <div className="pl-12">├── 011-Fix-Decompiled-PathComputationType-Switch.patch</div>
          <div className="pl-12">├── 012-Cache-Static-Collision-Shapes.patch</div>
          <div className="pl-12">├── 013-Veltis-Built-in-Datapack.patch</div>
          <div className="pl-12">├── 014-Sync-Veltis-Chunk-Activity.patch</div>
          <div className="pl-12">└── 015-Off-Thread-Network-Compression.patch</div>
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
            The pipeline applies patches to a working copy, you edit there, then export the result
            back into patch files.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white">1. Apply the existing patch set</h4>
          <CodeBlock
            language="bash"
            code={`# Decompiles the server and applies the patches into a working tree
./gradlew applyPatches`}
          />

          <h4 className="text-sm font-semibold text-white">2. Edit in the applied working tree</h4>
          <p className="text-xs text-slate-400">
            Make your change in the patched sources under <code>minecraft/workspace/</code> and
            commit it with Git.
          </p>

          <h4 className="text-sm font-semibold text-white">3. Export commits back to patch files</h4>
          <CodeBlock
            language="bash"
            code={`# Writes your commits back out as .patch files in server/Shulker/code/
./gradlew rebuildPatches`}
          />

          <h4 className="text-sm font-semibold text-white">4. Build the server</h4>
          <CodeBlock
            language="bash"
            code={`# Produces the distributable at build/distributions/veltis.jar
./gradlew buildVeltisMC`}
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
            When upstream changes conflict with an existing patch, application stops and leaves
            standard Git conflict markers (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>). Resolve the
            conflict, stage the files, and continue the patch application. Running{' '}
            <code>./gradlew rebuildPatches</code> afterwards records the resolution back into the
            patch files.
          </p>
        </div>
      </section>
    </div>
  )
}
