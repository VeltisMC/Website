import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import DocsLayout from './layouts/DocsLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'))
const DocsPage = lazy(() => import('./pages/DocsPage'))
const DevelopersPage = lazy(() => import('./pages/DevelopersPage'))
const CommunityPage = lazy(() => import('./pages/CommunityPage'))
const ContributingPage = lazy(() => import('./pages/ContributingPage'))
const ChangelogPage = lazy(() => import('./pages/ChangelogPage'))
const LicensePage = lazy(() => import('./pages/LicensePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function RouteFallback() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/downloads" element={<DownloadsPage />} />

            {/* Documentation Nested Routes */}
            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<Navigate to="/docs/introduction" replace />} />
              <Route path=":slug" element={<DocsPage />} />
            </Route>

            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/contributing" element={<ContributingPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/license" element={<LicensePage />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
