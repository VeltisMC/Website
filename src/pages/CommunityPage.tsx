import { MessageSquare, HelpCircle, Bug, ArrowRight, Shield } from 'lucide-react'
import { siteConfig } from '../config/site'
import Badge from '../components/common/Badge'

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="violet">VELTIS ECOSYSTEM</Badge>
          <Badge variant="cyan">GET INVOLVED</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Community & Support
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          Veltis is an open collaboration among Minecraft server engineers, technical operators, and
          optimization researchers. Connect with other developers, share benchmarks, and get assistance.
        </p>
      </div>

      {/* 2. Official Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Discord */}
        <div className="p-6 rounded-xl border border-brand-border bg-brand-surface space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-lg bg-violet-500/10 text-violet-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Discord Community</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time chat with the core development team, performance benchmarking discussions,
              and live troubleshooting assistance.
            </p>
          </div>
          <a
            href={siteConfig.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs transition-colors"
          >
            <span>Join Veltis Discord</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* GitHub Discussions */}
        <div className="p-6 rounded-xl border border-brand-border bg-brand-surface space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-lg bg-sky-500/10 text-sky-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">GitHub Discussions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Asynchronous architectural debates, feature requests, RFC proposals, and long-term
              roadmap design threads.
            </p>
          </div>
          <a
            href={`${siteConfig.github}/discussions`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg border border-brand-border bg-[#0d101a] hover:bg-white/5 text-slate-200 font-medium text-xs transition-colors"
          >
            <span>Browse Discussions</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Issue Tracker */}
        <div className="p-6 rounded-xl border border-brand-border bg-brand-surface space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-lg bg-rose-500/10 text-rose-400">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Issue Tracker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Report reproducible bugs, tick stall traces, and JVM crash reports with detailed steps
              and Spark sampler URLs.
            </p>
          </div>
          <a
            href={`${siteConfig.github}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg border border-brand-border bg-[#0d101a] hover:bg-white/5 text-slate-200 font-medium text-xs transition-colors"
          >
            <span>Report an Issue</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 3. Community Guidelines & Code of Conduct */}
      <section className="p-8 rounded-xl border border-brand-border bg-[#0e111a] space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-bold text-white">Community Code of Conduct</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          We are committed to providing a friendly, respectful, and harassment-free environment for everyone,
          regardless of background, identity, or technical experience. When participating across Discord, GitHub,
          and forums, keep technical critiques constructive and focus on verifiable software outcomes.
        </p>
      </section>
    </div>
  )
}
