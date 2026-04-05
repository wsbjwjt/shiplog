import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/[userSlug]/[productSlug] - Get public product info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userSlug: string; productSlug: string }> }
) {
  try {
    const { userSlug, productSlug } = await params

    // Find team by slug
    const team = await prisma.team.findUnique({
      where: { slug: userSlug },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }

    // Check for redirect first
    const redirect = await prisma.redirect.findFirst({
      where: {
        product: {
          teamId: team.id,
        },
        oldSlug: productSlug,
      },
      include: {
        product: true,
      },
    })

    if (redirect) {
      return NextResponse.json(
        {
          redirect: true,
          newSlug: redirect.newSlug,
        },
        {
          status: 301,
          headers: {
            'X-Redirect-URL': `/p/${userSlug}/${redirect.newSlug}`,
          },
        }
      )
    }

    // Find product
    const product = await prisma.product.findFirst({
      where: {
        teamId: team.id,
        slug: productSlug,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        changelogs: {
          where: {
            publishedAt: {
              lte: new Date(),
            },
          },
          orderBy: {
            publishedAt: 'desc',
          },
          include: {
            votes: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching public product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
