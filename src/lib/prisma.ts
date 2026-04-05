import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    // During build, we need to return a mock or skip
    console.warn('DATABASE_URL not set, using placeholder for build')
    const pool = new Pool({
      connectionString: 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
    })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
