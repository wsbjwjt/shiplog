'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  voteCache: number
  team: {
    id: string
    name: string
    slug: string
  }
  changelogs: Array<{
    id: string
    version: string
    title: string
    content: string
    publishedAt: Date | null
    votes: Array<{
      id: string
      type: string
    }>
  }>
}

export function PublicProductPage({ product }: { product: Product }) {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-2 text-sm text-[#58a6ff]">
            {product.team.name}
          </div>
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          {product.description && (
            <p className="mt-2 text-gray-400">{product.description}</p>
          )}
          <div className="mt-4 text-sm text-gray-500">
            {product.changelogs.length} releases · {product.voteCache} votes
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {product.changelogs.length === 0 ? (
          <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-8 text-center">
            <p className="text-gray-400">No changelogs published yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {product.changelogs.map((changelog) => (
              <article
                key={changelog.id}
                className="rounded-lg border border-[#30363d] bg-[#161b22] p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#58a6ff]/20 px-3 py-1 text-sm font-medium text-[#58a6ff]">
                      v{changelog.version}
                    </span>
                    <h2 className="text-xl font-semibold text-white">
                      {changelog.title}
                    </h2>
                  </div>
                  {changelog.publishedAt && (
                    <time className="text-sm text-gray-500">
                      {new Date(changelog.publishedAt).toLocaleDateString()}
                    </time>
                  )}
                </div>

                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {changelog.content}
                  </ReactMarkdown>
                </div>

                <div className="mt-4 flex items-center gap-4 pt-4 border-t border-[#30363d]">
                  <button
                    className="flex items-center gap-1 text-gray-400 hover:text-green-400"
                    disabled
                  >
                    <span>👍</span>
                    <span>{changelog.votes.filter(v => v.type === 'UP').length}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 text-gray-400 hover:text-red-400"
                    disabled
                  >
                    <span>👎</span>
                    <span>{changelog.votes.filter(v => v.type === 'DOWN').length}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
