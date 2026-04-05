import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils-server'

// GET /api/products - List all products for the current user
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      where: {
        team: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
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
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            version: true,
            title: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, teamId } = body

    if (!name || !teamId) {
      return NextResponse.json(
        { error: 'Name and teamId are required' },
        { status: 400 }
      )
    }

    // Check user is a member of the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    })

    if (!teamMember) {
      return NextResponse.json(
        { error: 'You are not a member of this team' },
        { status: 403 }
      )
    }

    // Generate slug from name
    const baseSlug = slugify(name)
    let slug = baseSlug
    let counter = 1

    // Ensure slug is unique within the team
    while (await prisma.product.findFirst({
      where: {
        teamId,
        slug,
      },
    })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        teamId,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
