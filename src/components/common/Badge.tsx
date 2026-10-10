import type { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  variant?: 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate'
  size?: 'sm' | 'md'
  className?: string
}

export default function Badge({
  children,
  variant = 'violet',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    violet: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    cyan: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    slate: 'bg-slate-800/60 text-slate-400 border-slate-700/50',
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  )
}
