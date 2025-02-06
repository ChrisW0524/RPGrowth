// app/api/areas/[id]/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/areas/[id]
 * Fetch a single area owned by the current user
 */
export async function GET(_req: Request, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Retrieve the area by ID
    const area = await prisma.area.findUnique({
      where: { id: params.id },
      // Optional: include relations
      include: { containers: {include:{tasks: true}}, projects: true },
    });

    // Verify the area belongs to this user
    if (!area || area.userId !== userId) {
      return NextResponse.json(
        { error: "Area not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(area, { status: 200 });
  } catch (error) {
    console.error("Error fetching area:", error);
    return NextResponse.json({ error: "Error fetching area" }, { status: 500 });
  }
}

/**
 * PUT /api/areas/[id]
 * Update an area owned by the current user
 */
export async function PUT(req: Request, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ensure the existing area belongs to this user
    const existingArea = await prisma.area.findUnique({
      where: { id: params.id },
    });

    if (!existingArea || existingArea.userId !== userId) {
      return NextResponse.json(
        { error: "Area not found or unauthorized" },
        { status: 404 },
      );
    }

    // Parse the request body for the new data
    const body = await req.json();
    const { name } = body;

    // Update the area
    const updatedArea = await prisma.area.update({
      where: { id: params.id },
      data: { name },
    });

    return NextResponse.json(updatedArea, { status: 200 });
  } catch (error) {
    console.error("Error updating area:", error);
    return NextResponse.json({ error: "Error updating area" }, { status: 500 });
  }
}

/**
 * DELETE /api/areas/[id]
 * Remove an area owned by the current user
 */
export async function DELETE(_req: Request, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the area exists and belongs to the user
    const existingArea = await prisma.area.findUnique({
      where: { id: params.id },
    });

    if (!existingArea || existingArea.userId !== userId) {
      return NextResponse.json(
        { error: "Area not found or unauthorized" },
        { status: 404 },
      );
    }

    // Remove the area
    await prisma.area.delete({
      where: { id: params.id },
    });

    // Return 204 for successful deletion with no content
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting area:", error);
    return NextResponse.json({ error: "Error deleting area" }, { status: 500 });
  }
}
