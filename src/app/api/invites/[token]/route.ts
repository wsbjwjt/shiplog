import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/invites/[token] - Get invite details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const invite = await prisma.invite.findUnique({
      where: { token },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      )
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invite has expired' },
        { status: 400 }
      )
    }

    return NextResponse.json(invite)
  } catch (error) {
    console.error('Error fetching invite:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invite' },
      { status: 500 }
    )
  }
}

// POST /api/invites/[token] - Accept invite
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { token } = await params

    const invite = await prisma.invite.findUnique({
      where: { token },
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      )
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invite has expired' },
        { status: 400 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId: invite.teamId,
        userId: session.user.id,
      },
    })

    if (existingMember) {
      // Delete the invite anyway
      await prisma.invite.delete({ where: { id: invite.id } })
      return NextResponse.json(
        { error: 'You are already a member of this team' },
        { status: 400 }
      )
    }

    // Add user to team
    await prisma.teamMember.create({
      data: {
        teamId: invite.teamId,
        userId: session.user.id,
        role: invite.role,
      },
    })

    // Delete the invite
    await prisma.invite.delete({ where: { id: invite.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error accepting invite:', error)
    return NextResponse.json(
      { error: 'Failed to accept invite' },
      { status: 500 }
    )
  }
}
