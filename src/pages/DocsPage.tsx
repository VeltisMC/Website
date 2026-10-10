import { useParams, Link } from 'react-router-dom'
import { getDocBySlug, getAdjacentDocs } from '../content/docs'
import DocsBreadcrumbs from '../components/docs/DocsBreadcrumbs'
import DocsToc from '../components/docs/DocsToc'
import DocsPager from '../components/docs/DocsPager'
import { BookOpen } from 'lucide-react'

export default function DocsPage() {
  const { slug } = useParams<{ slug?: string }>()
  const activeSlug = slug || 'introduction'
  const article = getDocBySlug(activeSlug)
  const { prev, next } = getAdjacentDocs(activeSlug)

  if (!article) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Documentation Article Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested documentation topic &ldquo;{activeSlug}&rdquo; does not exist.
        </p>
        <Link
          to="/docs/introduction"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-medium"
        >
          <BookOpen className="w-4 h-4" />
          <span>Return to Introduction</span>
        </Link>
      </div>
    )
  }

  const ContentComponent = article.content

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Main Documentation Reader */}
      <article className="flex-1 min-w-0 space-y-8">
        <DocsBreadcrumbs article={article} />

        <div className="space-y-2 border-b border-white/5 pb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold">
              {article.section}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {article.title}
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            {article.description}
          </p>
        </div>

        {/* Dynamic Article Content */}
        <div className="prose prose-invert max-w-none">
          <ContentComponent />
        </div>

        {/* Prev / Next Pagination */}
        <DocsPager prev={prev} next={next} />
      </article>

      {/* Right Column: In-Page Table of Contents */}
      <div className="hidden xl:block w-56 shrink-0 sticky top-24 self-start">
        <DocsToc headings={article.headings} />
      </div>
    </div>
  )
}
