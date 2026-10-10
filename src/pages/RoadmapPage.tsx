import { useState } from 'react'
import { Clock, ExternalLink } from 'lucide-react'
import { roadmapItems, roadmapStatusMeta, type RoadmapStatus } from '../config/roadmap'
import Badge from '../components/common/Badge'

export default function RoadmapPage() {
  const [selectedStatus, setSelectedStatus] = useState<RoadmapStatus | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'Runtime', 'Patches', 'API', 'Tooling', 'Networking', 'Docs']
  const statuses: (RoadmapStatus | 'all')[] = ['all', 'completed', 'in-progress', 'planned', 'investigating']

  const filteredItems = roadmapItems.filter((item) => {
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
    return statusMatch && categoryMatch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="violet">DEVELOPMENT TRACKER</Badge>
          <Badge variant="cyan">PUBLIC MILESTONES</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Project Roadmap
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          Transparent development priorities for the Veltis server software. Milestones are categorized into
          completed features, active implementations, planned deliverables, and architectural research spikes.
        </p>
      </div>

      {/* 2. Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-brand-border bg-brand-surface">
        {/* Status Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-mono uppercase text-slate-400 mr-2 shrink-0">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all shrink-0 capitalize ${
                selectedStatus === st
                  ? 'bg-violet-600 text-white font-semibold'
                  : 'bg-[#0b0e17] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {st === 'all' ? 'All Statuses' : roadmapStatusMeta[st].label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase text-slate-400 shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-md text-xs font-mono bg-[#0b0e17] text-slate-300 border border-brand-border focus:outline-none focus:border-violet-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Status Column Previews / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {(['completed', 'in-progress', 'planned', 'investigating'] as RoadmapStatus[]).map((st) => {
          const meta = roadmapStatusMeta[st]
          const count = roadmapItems.filter((i) => i.status === st).length
          return (
            <div
              key={st}
              onClick={() => setSelectedStatus(st === selectedStatus ? 'all' : st)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'border-violet-500 bg-violet-950/20'
                  : 'border-brand-border bg-brand-surface/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-semibold uppercase text-white">
                  {meta.label}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/5 text-slate-300">
                  {count}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{meta.description}</p>
            </div>
          )
        })}
      </div>

      {/* 4. Roadmap Items List */}
      <div className="space-y-4">
        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
          Showing {filteredItems.length} milestone items
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const statusInfo = roadmapStatusMeta[item.status]
            return (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-brand-border bg-brand-surface hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border ${statusInfo.badgeClass}`}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  {item.targetVersion ? (
                    <div className="flex items-center space-x-1.5 text-violet-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Target: {item.targetVersion}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">Target: TBD</span>
                  )}

                  <a
                    href="https://github.com/VeltisMC/Veltis/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-300"
                  >
                    <span>Discuss on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
