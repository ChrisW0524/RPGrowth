import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";

/**
 * GET /api/areas
 * Fetch all areas with their projects (but not project containers)
 */
export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const areas = await prisma.area.findMany({
      where: { userId },
      include: {
        projects: true,  // ✅ Fetch projects but NOT their containers
      },
    });

    return NextResponse.json(areas, { status: 200 });
  } catch (error) {
    console.error("Error fetching areas:", error);
    return NextResponse.json({ error: "Error fetching areas" }, { status: 500 });
  }
}
