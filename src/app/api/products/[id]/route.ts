import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id] - Get a single product
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
            publishedAt: 'desc',
          },
        },
        redirects: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a product
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
    const { name, description, slug: newSlug } = body

    // Check user has access and get current product
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        team: {
          members: {
            some: {
              userId: session.user.id,
              role: 'OWNER',
            },
          },
        },
      },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found or you do not have permission' },
        { status: 404 }
      )
    }

    let slug = existingProduct.slug

    // If slug is being changed, create a redirect
    if (newSlug && newSlug !== existingProduct.slug) {
      // Check new slug is unique
      const slugExists = await prisma.product.findFirst({
        where: {
          teamId: existingProduct.teamId,
          slug: newSlug,
          id: { not: id },
        },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already in use' },
          { status: 400 }
        )
      }

      // Create redirect from old to new
      await prisma.redirect.create({
        data: {
          oldSlug: existingProduct.slug,
          newSlug,
          productId: id,
        },
      })

      slug = newSlug
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? existingProduct.name,
        description: description ?? existingProduct.description,
        slug,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a product
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
    const product = await prisma.product.findFirst({
      where: {
        id,
        team: {
          members: {
            some: {
              userId: session.user.id,
              role: 'OWNER',
            },
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or you do not have permission' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
