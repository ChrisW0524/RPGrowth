import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";

// GET: Fetch a single task (must be owned by the current user)
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!task || task.userId !== userId) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching task" }, { status: 500 });
  }
}

// PUT: Update a single task (must be owned by the current user)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if existing task belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask || existingTask.userId !== userId) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      tags,
      priority,
      status,
      difficulty,
      estimate,
      dueDate,
      areaId,
      projectId,
      containerId,
      exp,
      gold,
    } = body;

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        title,
        description,
        tags,
        priority,
        status,
        difficulty,
        estimate,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        areaId,
        projectId,
        containerId,
        exp,
        gold,
        // Do NOT overwrite userId (ensures task remains associated with the original owner)
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}

// DELETE: Remove a single task (must be owned by the current user)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ensure the task belongs to the current user
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask || existingTask.userId !== userId) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 },
      );
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: params.id },
    });

    // ✅ Return 200 with a JSON message
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
