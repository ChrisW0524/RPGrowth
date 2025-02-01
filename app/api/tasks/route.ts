import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/prisma/prisma';

// GET: Fetch all tasks for the authenticated user
export async function GET() {
  // ✅ Await auth() to retrieve the userId
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
  }
}

// POST: Create a new task for the authenticated user
export async function POST(req: Request) {
  const { userId } = await auth(); // ✅ Await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    const newTask = await prisma.task.create({
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
        userId, // ✅ Set userId correctly
        exp,
        gold,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
  }
}
