import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PublicProductPage } from './client'

interface Props {
  params: Promise<{
    userSlug: string
    productSlug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userSlug, productSlug } = await params

  const team = await prisma.team.findUnique({
    where: { slug: userSlug },
  })

  if (!team) {
    return {}
  }

  const product = await prisma.product.findFirst({
    where: {
      teamId: team.id,
      slug: productSlug,
    },
  })

  if (!product) {
    return {}
  }

  const title = `${product.name} - Changelog`
  const description = product.description || `View the changelog for ${product.name}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [`/api/og?title=${encodeURIComponent(product.description || '')}&product=${encodeURIComponent(product.name)}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?title=${encodeURIComponent(product.description || '')}&product=${encodeURIComponent(product.name)}`],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { userSlug, productSlug } = await params

  const team = await prisma.team.findUnique({
    where: { slug: userSlug },
  })

  if (!team) {
    notFound()
  }

  // Check for redirect
  const redirectRecord = await prisma.redirect.findFirst({
    where: {
      product: {
        teamId: team.id,
      },
      oldSlug: productSlug,
    },
  })

  if (redirectRecord) {
    redirect(`/p/${userSlug}/${redirectRecord.newSlug}`)
  }

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
    notFound()
  }

  return <PublicProductPage product={product} />
}
