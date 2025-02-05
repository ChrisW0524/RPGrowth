// app/api/areas/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/prisma/prisma';

/**
 * GET /api/areas
 * List all areas for the current user
 */
export async function GET() {
  // Retrieve the logged-in user's ID from Clerk
  const { userId } = await auth();

  // If not authenticated, return 401
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find all areas owned by this user
    const areas = await prisma.area.findMany({
      where: { userId },
      // Optional: you can also include related projects or containers
      // include: {
      //   projects: true,
      //   containers: true,
      //   Task: true
      // }
    });

    return NextResponse.json(areas, { status: 200 });
  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json({ error: 'Error fetching areas' }, { status: 500 });
  }
}

/**
 * POST /api/areas
 * Create a new area for the current user
 */
export async function POST(req: Request) {
  const { userId } = await auth();

  // Must be signed in
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { name } = body;

    // Create a new area, linking it to the logged-in user
    const newArea = await prisma.area.create({
      data: {
        name,
        userId, // Force the userId to the current clerk user
      },
    });

    return NextResponse.json(newArea, { status: 201 });
  } catch (error) {
    console.error('Error creating area:', error);
    return NextResponse.json({ error: 'Error creating area' }, { status: 500 });
  }
}
