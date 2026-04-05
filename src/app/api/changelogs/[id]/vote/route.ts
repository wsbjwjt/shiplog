import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/changelogs/[id]/vote - Vote on a changelog
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
    const { type } = body // 'UP', 'DOWN', or null to remove

    // Get the changelog with product
    const changelog = await prisma.changelog.findUnique({
      where: { id },
      include: { product: true },
    })

    if (!changelog) {
      return NextResponse.json(
        { error: 'Changelog not found' },
        { status: 404 }
      )
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        changelogId_userId: {
          changelogId: id,
          userId: session.user.id,
        },
      },
    })

    // Calculate vote delta for updating voteCache
    let voteDelta = 0

    if (type === null) {
      // Remove vote
      if (existingVote) {
        await prisma.vote.delete({
          where: { id: existingVote.id },
        })
        voteDelta = existingVote.type === 'UP' ? -1 : 1
      }
    } else if (type === 'UP' || type === 'DOWN') {
      if (existingVote) {
        if (existingVote.type === type) {
          // Same vote, remove it
          await prisma.vote.delete({
            where: { id: existingVote.id },
          })
          voteDelta = type === 'UP' ? -1 : 1
        } else {
          // Change vote type
          await prisma.vote.update({
            where: { id: existingVote.id },
            data: { type },
          })
          voteDelta = type === 'UP' ? 2 : -2
        }
      } else {
        // New vote
        await prisma.vote.create({
          data: {
            changelogId: id,
            userId: session.user.id,
            type,
          },
        })
        voteDelta = type === 'UP' ? 1 : -1
      }
    }

    // Update voteCache on product
    if (voteDelta !== 0) {
      await prisma.product.update({
        where: { id: changelog.productId },
        data: {
          voteCache: {
            increment: voteDelta,
          },
        },
      })
    }

    // Return updated vote info
    const updatedChangelog = await prisma.changelog.findUnique({
      where: { id },
      include: {
        votes: {
          where: {
            userId: session.user.id,
          },
        },
        product: {
          select: {
            voteCache: true,
          },
        },
      },
    })

    return NextResponse.json({
      vote: updatedChangelog?.votes[0] || null,
      voteCache: updatedChangelog?.product.voteCache,
    })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}
