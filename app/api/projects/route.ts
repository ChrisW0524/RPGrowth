// app/api/projects/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/prisma/prisma'; // Update your import path

/**
 * GET /api/projects
 * Fetch all projects owned by the current user
 */
export async function GET() {
  const { userId } = await auth();

  // If no user is signed in, return 401
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Retrieve all projects matching the current user
    const projects = await prisma.project.findMany({
      where: {
        userId
      },
      // You can also include related containers or tasks if needed:
      // include: { containers: true, Task: true },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}

/**
 * POST /api/projects
 * Create a new project for the current user
 */
export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, areaId } = body; // minimal fields; add more if needed

    // Create a new project, linking it to the logged-in user
    const newProject = await prisma.project.create({
      data: {
        name,
        areaId,
        userId, // Force the userId from Clerk, don't trust client input
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
  }
}
