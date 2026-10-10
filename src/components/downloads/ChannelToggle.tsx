import { AlertTriangle, CheckCircle } from 'lucide-react'
import type { ReleaseChannel } from '../../types/release'

export interface ChannelToggleProps {
  channel: ReleaseChannel
  onToggle: (channel: ReleaseChannel) => void
}

const CHANNEL_BUTTONS: {
  channel: ReleaseChannel
  label: string
  active: string
}[] = [
  { channel: 'stable', label: 'Stable Channel', active: 'bg-violet-600 text-white font-semibold' },
  { channel: 'beta', label: 'Beta Channel', active: 'bg-sky-600 text-white font-semibold' },
  { channel: 'nightly', label: 'Nightly Channel', active: 'bg-amber-600 text-white font-semibold' },
]

const CHANNEL_NOTES: Record<ReleaseChannel, { tone: string; text: string }> = {
  stable: {
    tone: 'text-xs text-slate-400 font-mono',
    text: 'Recommended for production server deployments.',
  },
  beta: {
    tone: 'text-xs text-sky-300/90 font-mono',
    text: 'Beta builds are feature-complete but may still change. Test before production.',
  },
  nightly: {
    tone: 'text-xs text-amber-300/90 font-mono',
    text: 'Nightly builds contain the latest patches and may be unstable. Test before production.',
  },
}

export default function ChannelToggle({ channel, onToggle }: ChannelToggleProps) {
  const note = CHANNEL_NOTES[channel]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-brand-border bg-brand-surface">
      <div className="flex items-center space-x-1.5 p-1 rounded-md bg-[#090b11] border border-white/5 w-fit">
        {CHANNEL_BUTTONS.map((entry) => (
          <button
            key={entry.channel}
            type="button"
            onClick={() => onToggle(entry.channel)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-mono transition-all ${
              channel === entry.channel ? entry.active : 'text-slate-400 hover:text-white'
            }`}
          >
            {entry.channel === 'stable' ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle
                className={`w-3.5 h-3.5 ${
                  entry.channel === 'beta' ? 'text-sky-300' : 'text-amber-300'
                }`}
              />
            )}
            <span>{entry.label}</span>
          </button>
        ))}
      </div>

      <div className={`flex items-center space-x-2 ${note.tone}`}>
        {channel !== 'stable' && <AlertTriangle className="w-4 h-4 shrink-0" />}
        <span>{note.text}</span>
      </div>
    </div>
  )
}
