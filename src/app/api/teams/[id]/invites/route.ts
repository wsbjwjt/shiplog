import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// POST /api/teams/[id]/invites - Create an invite
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
    const { email, role = 'MEMBER' } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check user is OWNER of the team
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        userId: session.user.id,
        role: 'OWNER',
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Only team owners can invite members' },
        { status: 403 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        user: { email },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a team member' },
        { status: 400 }
      )
    }

    // Check for existing invite
    const existingInvite = await prisma.invite.findFirst({
      where: {
        teamId: id,
        email,
        expiresAt: { gt: new Date() },
      },
    })

    if (existingInvite) {
      return NextResponse.json(
        { error: 'Active invite already exists for this email' },
        { status: 400 }
      )
    }

    // Create invite with token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    const invite = await prisma.invite.create({
      data: {
        teamId: id,
        email,
        token,
        role,
        expiresAt,
      },
    })

    return NextResponse.json({
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      },
      inviteUrl: `/invite/${invite.token}`,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating invite:', error)
    return NextResponse.json(
      { error: 'Failed to create invite' },
      { status: 500 }
    )
  }
}

// GET /api/teams/[id]/invites - List invites for a team
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

    // Check user is a member
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        userId: session.user.id,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const invites = await prisma.invite.findMany({
      where: {
        teamId: id,
        expiresAt: { gt: new Date() },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(invites)
  } catch (error) {
    console.error('Error fetching invites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invites' },
      { status: 500 }
    )
  }
}
