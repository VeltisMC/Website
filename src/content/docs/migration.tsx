import type { DocArticle } from '../../types/docs'
import CodeBlock from '../../components/common/CodeBlock'

export const migrationDocs: DocArticle[] = [
  {
    slug: 'migrating-from-paper',
    title: 'Migrating from Existing Servers',
    description: 'Guidelines for safely migrating existing server directories and world saves to Veltis.',
    section: 'Migration',
    order: 1,
    headings: [
      { id: 'world-compatibility', title: 'World Save Compatibility', level: 2 },
      { id: 'step-by-step', title: 'Migration Steps', level: 2 },
      { id: 'important-notes', title: 'Important Operational Notes', level: 2 },
    ],
    content: () => (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed text-lg">
          Migrating world saves from an existing server to Veltis is straightforward. Veltis uses standard
          Minecraft Anvil world storage format without modifying standard block data on disk.
        </p>

        <h2 id="world-compatibility" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          World Save Compatibility
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Veltis preserves standard Minecraft world formats (<code>world/region/*.mca</code>, <code>entities/*.mca</code>, <code>poi/*.mca</code>).
          You can drop existing world saves directly into your Veltis server directory without any world conversion scripts.
        </p>

        <h2 id="step-by-step" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Migration Steps
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-slate-300">
          <li>
            <strong>Back up everything:</strong> Always create a full backup of your world files and server folder before migrating.
          </li>
          <li>
            <strong>Verify Java 25+ / JDK 26:</strong> Ensure your host environment has JDK 26 or Java 25+ installed:
            <CodeBlock code={`java -version`} language="bash" />
          </li>
          <li>
            <strong>Place Veltis Distribution:</strong> Copy your <code>veltis.jar</code> into the server folder.
          </li>
          <li>
            <strong>Launch the Server:</strong> Start Veltis using:
            <CodeBlock code={`java -jar veltis.jar --nogui`} language="bash" />
          </li>
        </ol>

        <h2 id="important-notes" className="text-2xl font-bold text-white pt-6 border-t border-white/5">
          Important Operational Notes
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Veltis works directly with Minecraft&apos;s server code rather than Bukkit/Paper. Plugin support and extension
          APIs are under active development and not yet finalized.
        </p>
      </div>
    ),
  },
]
