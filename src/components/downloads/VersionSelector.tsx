export interface VersionSelectorProps {
  versions: string[]
  selectedVersion: string
  onSelectVersion: (version: string) => void
}

export default function VersionSelector({
  versions,
  selectedVersion,
  onSelectVersion,
}: VersionSelectorProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      <span className="text-xs font-mono uppercase text-slate-400 mr-2 shrink-0">
        Minecraft Version:
      </span>
      {versions.map((ver) => {
        const isSelected = ver === selectedVersion
        return (
          <button
            key={ver}
            type="button"
            onClick={() => onSelectVersion(ver)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono transition-all shrink-0 ${
              isSelected
                ? 'bg-violet-600 text-white font-semibold shadow-sm shadow-violet-600/30'
                : 'bg-brand-surface text-slate-400 hover:text-white hover:bg-white/5 border border-brand-border'
            }`}
          >
            {ver}
          </button>
        )
      })}
    </div>
  )
}
