import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Check, Copy } from 'lucide-react'

export interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

export default function CodeBlock({
  code,
  language = 'bash',
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  // Map non-standard languages to Prism supported ones
  const mappedLanguage =
    language === 'plaintext' || language === 'bat' || language === 'properties'
      ? 'bash'
      : language

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-brand-border bg-[#0d0f17]">
      {/* Header if filename or language pill is shown */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121520] border-b border-brand-border text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-2">
          {filename ? (
            <span className="text-slate-200 font-medium">{filename}</span>
          ) : (
            <span className="text-violet-400 uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <Highlight
        theme={themes.nightOwl}
        code={code.trim()}
        language={mappedLanguage as never}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="p-4 text-xs md:text-sm font-mono overflow-x-auto leading-relaxed"
            style={{ ...style, backgroundColor: 'transparent' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono text-xs">
                    {i + 1}
                  </span>
                )}
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
