import { ExternalLink } from 'lucide-react'
import { siteConfig } from '../config/site'
import Badge from '../components/common/Badge'

const currentYear = new Date().getFullYear()

export default function LicensePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="emerald">FREE & OPEN SOURCE SOFTWARE</Badge>
          <Badge variant="violet">GPL-3.0</Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          License
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Veltis is licensed under the GNU General Public License v3.0 (GPL-3.0).
          This ensures the software remains permanently free, auditable, and open for the Minecraft community.
        </p>
      </div>

      {/* 2. Key Terms Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-1">
          <h4 className="text-sm font-bold text-emerald-400">Commercial Use</h4>
          <p className="text-xs text-slate-400">
            You may operate commercial Minecraft servers powered by Veltis without royalty fees.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-1">
          <h4 className="text-sm font-bold text-sky-400">Modification</h4>
          <p className="text-xs text-slate-400">
            You may modify the source code, add custom patches, and rebuild the software freely.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-brand-border bg-brand-surface space-y-1">
          <h4 className="text-sm font-bold text-violet-400">Distribution</h4>
          <p className="text-xs text-slate-400">
            If you distribute binaries with modifications, you must release your source code under the same license.
          </p>
        </div>
      </div>

      {/* 3. Verbatim License Text Box */}
      <div className="p-6 rounded-xl border border-brand-border bg-[#0a0d16] font-mono text-xs text-slate-400 space-y-4 leading-relaxed">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 text-slate-300">
          <span className="font-bold">GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007</span>
          <a
            href="https://www.gnu.org/licenses/gpl-3.0.en.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-violet-400 hover:underline"
          >
            <span>Official FSF Text</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p>Copyright &copy; 2024-{currentYear} {siteConfig.fullName} contributors.</p>

        <p>
          Everyone is permitted to copy and distribute verbatim copies of this license document,
          but changing it is not allowed.
        </p>

        <p>
          The GNU General Public License is a free, copyleft license for software and other kinds of works.
          The licenses for most software and other practical works are designed to take away your freedom to share
          and change the works. By contrast, the GNU General Public License is intended to guarantee your freedom
          to share and change all versions of a program--to make sure it remains free software for all its users.
        </p>

        <p>
          THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE
          STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM &ldquo;AS IS&rdquo; WITHOUT
          WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
          OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
        </p>
      </div>
    </div>
  )
}
