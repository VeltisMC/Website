import { Link } from 'react-router-dom'
import GithubIcon from './GithubIcon'
import DiscordIcon from './DiscordIcon'
import { siteConfig } from '../../config/site'
import { footerSections } from '../../config/navigation'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-[#07080c] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Manifesto Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="Veltis logo" className="h-7 w-auto object-contain" />
              <span className="font-bold text-lg text-white">{siteConfig.fullName}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#5865F2] transition-colors"
                aria-label="Discord"
              >
                <DiscordIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-mono space-y-4 md:space-y-0">
          <div>
            &copy; {currentYear} {siteConfig.fullName} contributors. Released under the{' '}
            <Link to="/license" className="text-violet-400 hover:underline">
              {siteConfig.license} License
            </Link>
            .
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/license" className="hover:text-slate-400">
              License
            </Link>
            <Link to="/contributing" className="hover:text-slate-400">
              Contributing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
