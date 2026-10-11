import { channelDefinition } from '../../config/channels'

export interface ChannelBadgeProps {
  channel: string
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Renders a channel's name on its registry colour. The name is always shown, so
 * the badge never relies on colour alone to carry meaning. Unknown channels are
 * shown verbatim on a neutral colour rather than being silently dropped.
 */
export default function ChannelBadge({ channel, size = 'sm', className = '' }: ChannelBadgeProps) {
  const def = channelDefinition(channel)
  const sizeStyles = size === 'md' ? 'text-xs px-2.5 py-1' : 'text-xs px-2 py-0.5'

  if (!def) {
    return (
      <span
        className={`inline-flex items-center font-mono font-semibold rounded border border-slate-700/60 bg-slate-800/60 text-slate-300 ${sizeStyles} ${className}`}
        title={`Unrecognised channel: ${channel}`}
      >
        {channel || 'Unknown'}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded border border-white/10 ${sizeStyles} ${className}`}
      style={{ backgroundColor: def.color, color: def.textColor }}
      title={def.description}
    >
      {def.label}
    </span>
  )
}
