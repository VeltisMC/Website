import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import DocsSidebar from '../components/docs/DocsSidebar'

export default function DocsLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mobile Sidebar Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between py-3 border-b border-brand-border bg-[#090a0f] sticky top-16 z-30">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center space-x-2 text-xs font-mono text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md border border-brand-border bg-brand-surface"
        >
          <Menu className="w-4 h-4 text-violet-400" />
          <span>Documentation Menu</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-72 h-full bg-[#0d0f17] border-r border-brand-border p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <DocsSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Grid Layout: Desktop Sidebar + Content */}
      <div className="flex">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-brand-border pr-6 overflow-y-auto">
          <DocsSidebar />
        </div>

        {/* Content Outlet */}
        <div className="flex-1 min-w-0 py-8 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
