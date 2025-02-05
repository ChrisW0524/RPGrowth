// =/ app/api/projects/[id]/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/prisma/prisma';

interface Params {
  params: {
    id: string;
  };
}

/**
 * GET /api/projects/[id]
 * Fetch a single project (must be owned by the current user)
 */
export async function GET(_req: Request, { params }: Params) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find the project by ID
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      // include: { containers: true, Task: true } // If you want relations
    });

    // Check ownership
    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Error fetching project' }, { status: 500 });
  }
}

/**
 * PUT /api/projects/[id]
 * Update a single project (must be owned by the current user)
 */
export async function PUT(req: Request, { params }: Params) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Make sure the project exists and belongs to current user
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existingProject || existingProject.userId !== userId) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Parse the request body for fields to update
    const body = await req.json();
    const { name, areaId } = body;

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        name,
        areaId,
        // userId is not updated; it's fixed at creation time
      },
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Error updating project' }, { status: 500 });
  }
}

/**
 * DELETE /api/projects/[id]
 * Remove a single project (must be owned by the current user)
 */
export async function DELETE(_req: Request, { params }: Params) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find the project
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existingProject || existingProject.userId !== userId) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Delete it
    await prisma.project.delete({
      where: { id: params.id },
    });

    // Return 204 with no body to indicate successful deletion
    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
  }
}
