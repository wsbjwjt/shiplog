'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  voteCache: number
  changelogs: Array<{
    id: string
    version: string
    title: string
    createdAt: string
  }>
}

export function DashboardClient({ user }: { user: User }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user.name || user.email}</span>
            <Link
              href="/api/auth/signout"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Your Products</h2>
          <Link
            href="/dashboard/products/new"
            className="rounded-md bg-[#58a6ff] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            New Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-8 text-center">
            <h3 className="mb-2 text-lg font-medium text-white">
              No products yet
            </h3>
            <p className="mb-4 text-gray-400">
              Create your first product to start publishing changelogs.
            </p>
            <Link
              href="/dashboard/products/new"
              className="rounded-md bg-[#58a6ff] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Create Product
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}`}
                className="rounded-lg border border-[#30363d] bg-[#161b22] p-6 transition-colors hover:border-[#58a6ff]"
              >
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{product.changelogs.length} changelogs</span>
                  <span>{product.voteCache} votes</span>
                </div>
                {product.changelogs.length > 0 && (
                  <div className="mt-4 border-t border-[#30363d] pt-4">
                    <p className="text-xs text-gray-500">
                      Latest: {product.changelogs[0].version}
                    </p>
                    <p className="text-sm text-gray-400">
                      {product.changelogs[0].title}
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
