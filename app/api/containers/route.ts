// app/api/containers/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/prisma/prisma';

/**
 * GET /api/containers
 * List all containers for the current user
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch containers where userId matches
    const containers = await prisma.container.findMany({
      where: { userId },
      // You can also include any relations if needed:
      // include: { tasks: true, area: true, project: true },
    });

    return NextResponse.json(containers, { status: 200 });
  } catch (error) {
    console.error('Error fetching containers:', error);
    return NextResponse.json({ error: 'Error fetching containers' }, { status: 500 });
  }
}

/**
 * POST /api/containers
 * Create a new container for the current user
 */
export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, areaId, projectId } = body; // or other fields in Container

    const newContainer = await prisma.container.create({
      data: {
        name,
        areaId,
        projectId,
        userId, // Force userId from Clerk
      },
    });

    return NextResponse.json(newContainer, { status: 201 });
  } catch (error) {
    console.error('Error creating container:', error);
    return NextResponse.json({ error: 'Error creating container' }, { status: 500 });
  }
}
