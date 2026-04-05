import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizeSemver, isValidSemver } from '@/lib/utils-server'

// GET /api/changelogs/[id] - Get a single changelog
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

    const changelog = await prisma.changelog.findFirst({
      where: {
        id,
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
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            team: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    })

    if (!changelog) {
      return NextResponse.json(
        { error: 'Changelog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(changelog)
  } catch (error) {
    console.error('Error fetching changelog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch changelog' },
      { status: 500 }
    )
  }
}

// PUT /api/changelogs/[id] - Update a changelog
export async function PUT(
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

    // Check user has access
    const existing = await prisma.changelog.findFirst({
      where: {
        id,
        product: {
          team: {
            members: {
              some: {
                userId: session.user.id,
                role: 'OWNER',
              },
            },
          },
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Changelog not found or access denied' },
        { status: 404 }
      )
    }

    let normalizedVersion = existing.version
    if (version && version !== existing.version) {
      if (!isValidSemver(version)) {
        return NextResponse.json(
          { error: 'Invalid version format' },
          { status: 400 }
        )
      }
      normalizedVersion = normalizeSemver(version)
    }

    const changelog = await prisma.changelog.update({
      where: { id },
      data: {
        version: normalizedVersion,
        title: title ?? existing.title,
        content: content ?? existing.content,
        publishedAt: publishedAt ? new Date(publishedAt) : existing.publishedAt,
      },
    })

    return NextResponse.json(changelog)
  } catch (error) {
    console.error('Error updating changelog:', error)
    return NextResponse.json(
      { error: 'Failed to update changelog' },
      { status: 500 }
    )
  }
}

// DELETE /api/changelogs/[id] - Delete a changelog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check user is OWNER
    const changelog = await prisma.changelog.findFirst({
      where: {
        id,
        product: {
          team: {
            members: {
              some: {
                userId: session.user.id,
                role: 'OWNER',
              },
            },
          },
        },
      },
    })

    if (!changelog) {
      return NextResponse.json(
        { error: 'Changelog not found or access denied' },
        { status: 404 }
      )
    }

    await prisma.changelog.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting changelog:', error)
    return NextResponse.json(
      { error: 'Failed to delete changelog' },
      { status: 500 }
    )
  }
}
