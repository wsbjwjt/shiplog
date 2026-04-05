import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizeSemver, isValidSemver } from '@/lib/utils-server'

// GET /api/products/[id]/changelogs - List changelogs for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const changelogs = await prisma.changelog.findMany({
      where: {
        productId: id,
        product: {
          team: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
      },
      include: {
        votes: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })

    return NextResponse.json(changelogs)
  } catch (error) {
    console.error('Error fetching changelogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch changelogs' },
      { status: 500 }
    )
  }
}

// POST /api/products/[id]/changelogs - Create a changelog
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { version, title, content, publishedAt } = body

    if (!version || !title || !content) {
      return NextResponse.json(
        { error: 'Version, title, and content are required' },
        { status: 400 }
      )
    }

    // Validate semver
    if (!isValidSemver(version)) {
      return NextResponse.json(
        { error: 'Invalid version format. Use semver (e.g., 1.0.0)' },
        { status: 400 }
      )
    }

    const normalizedVersion = normalizeSemver(version)

    // Check user has access to the product
    const product = await prisma.product.findFirst({
      where: {
        id,
        team: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or access denied' },
        { status: 404 }
      )
    }

    const changelog = await prisma.changelog.create({
      data: {
        version: normalizedVersion,
        title,
        content,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        productId: id,
      },
    })

    return NextResponse.json(changelog, { status: 201 })
  } catch (error) {
    console.error('Error creating changelog:', error)
    return NextResponse.json(
      { error: 'Failed to create changelog' },
      { status: 500 }
    )
  }
}
