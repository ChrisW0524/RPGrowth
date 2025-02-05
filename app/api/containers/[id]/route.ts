// app/api/containers/[id]/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/prisma/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/containers/[id]
 * Fetch a single container (must be owned by the current user)
 */
export async function GET(_req: Request, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const container = await prisma.container.findUnique({
      where: { id: params.id },
      // include: { tasks: true, area: true, project: true } if needed
    });

    // Ensure it exists & belongs to current user
    if (!container || container.userId !== userId) {
      return NextResponse.json({ error: 'Container not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(container, { status: 200 });
  } catch (error) {
    console.error('Error fetching container:', error);
    return NextResponse.json({ error: 'Error fetching container' }, { status: 500 });
  }
}

/**
 * PUT /api/containers/[id]
 * Update a container (must be owned by the current user)
 */
export async function PUT(req: Request, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check ownership
    const existingContainer = await prisma.container.findUnique({
      where: { id: params.id },
    });

    if (!existingContainer || existingContainer.userId !== userId) {
      return NextResponse.json({ error: 'Container not found or unauthorized' }, { status: 404 });
    }

    const body = await req.json();
    const { name, areaId, projectId } = body; // or any other fields

    const updatedContainer = await prisma.container.update({
      where: { id: params.id },
      data: {
        name,
        areaId,
        projectId,
        // Do NOT overwrite userId
      },
    });

    return NextResponse.json(updatedContainer, { status: 200 });
  } catch (error) {
    console.error('Error updating container:', error);
    return NextResponse.json({ error: 'Error updating container' }, { status: 500 });
  }
}

/**
 * DELETE /api/containers/[id]
 * Remove a single container (must be owned by the current user)
 */
export async function DELETE(_req: Request, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check ownership
    const existingContainer = await prisma.container.findUnique({
      where: { id: params.id },
    });

    if (!existingContainer || existingContainer.userId !== userId) {
      return NextResponse.json({ error: 'Container not found or unauthorized' }, { status: 404 });
    }

    // Delete
    await prisma.container.delete({
      where: { id: params.id },
    });

    // Return 204 for no content
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting container:', error);
    return NextResponse.json({ error: 'Error deleting container' }, { status: 500 });
  }
}
