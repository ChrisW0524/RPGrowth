import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1️⃣ Create a test user (Replace with real Clerk userId later)
  const testUserId = "user_2sQLgnrja0dYRnMPpkIKX62Vw0n"; // Your Clerk userId

  // 2️⃣ Create sample Areas
  const area1 = await prisma.area.create({
    data: { name: "Work", userId: testUserId },
  });

  const area2 = await prisma.area.create({
    data: { name: "Personal", userId: testUserId },
  });

  // 3️⃣ Create sample Projects under each Area
  const project1 = await prisma.project.create({
    data: { name: "Frontend Development", userId: testUserId, areaId: area1.id },
  });

  const project2 = await prisma.project.create({
    data: { name: "Fitness Tracker", userId: testUserId, areaId: area2.id },
  });

  // 4️⃣ Create standard Kanban Containers (Columns) for Projects
  await prisma.container.createMany({
    data: [
      // Project 1 Containers
      { name: "To-Do", userId: testUserId, projectId: project1.id },
      { name: "In Progress", userId: testUserId, projectId: project1.id },
      { name: "Done", userId: testUserId, projectId: project1.id },

      // Project 2 Containers
      { name: "To-Do", userId: testUserId, projectId: project2.id },
      { name: "In Progress", userId: testUserId, projectId: project2.id },
      { name: "Done", userId: testUserId, projectId: project2.id },
    ],
  });

  // 5️⃣ Create standard Kanban Containers (Columns) for Areas
  await prisma.container.createMany({
    data: [
      // Area 1 Containers
      { name: "To-Do", userId: testUserId, areaId: area1.id },
      { name: "In Progress", userId: testUserId, areaId: area1.id },
      { name: "Done", userId: testUserId, areaId: area1.id },

      // Area 2 Containers
      { name: "To-Do", userId: testUserId, areaId: area2.id },
      { name: "In Progress", userId: testUserId, areaId: area2.id },
      { name: "Done", userId: testUserId, areaId: area2.id },
    ],
  });

  // Retrieve newly created containers for Project 1
  const project1Containers = await prisma.container.findMany({
    where: { projectId: project1.id },
  });

  // Retrieve newly created containers for Project 2
  const project2Containers = await prisma.container.findMany({
    where: { projectId: project2.id },
  });

  // Retrieve newly created containers for Area 1 (for non-project tasks)
  const area1Containers = await prisma.container.findMany({
    where: { areaId: area1.id },
  });

  // Retrieve newly created containers for Area 2 (for non-project tasks)
  const area2Containers = await prisma.container.findMany({
    where: { areaId: area2.id },
  });

  // Map container names to IDs for easy task assignment
  const project1ContainerMap = Object.fromEntries(
    project1Containers.map((c) => [c.name, c.id])
  );

  const project2ContainerMap = Object.fromEntries(
    project2Containers.map((c) => [c.name, c.id])
  );

  const area1ContainerMap = Object.fromEntries(
    area1Containers.map((c) => [c.name, c.id])
  );

  const area2ContainerMap = Object.fromEntries(
    area2Containers.map((c) => [c.name, c.id])
  );

  // 6️⃣ Create sample Tasks assigned to proper containers
  await prisma.task.createMany({
    data: [
      // Project 1 Tasks
      {
        title: "Implement Login",
        description: "Set up Clerk authentication",
        userId: testUserId,
        projectId: project1.id,
        containerId: project1ContainerMap["To-Do"], // ✅ Assigned to To-Do
        priority: "HIGH",
        status: "IN_PROGRESS",
        difficulty: "MODERATE",
      },
      {
        title: "Build Dashboard UI",
        description: "Create the Kanban board layout",
        userId: testUserId,
        projectId: project1.id,
        containerId: project1ContainerMap["In Progress"], // ✅ Assigned to In Progress
        priority: "HIGH",
        status: "IN_PROGRESS",
        difficulty: "DIFFICULT",
      },
      {
        title: "Fix API Bug",
        description: "Resolve 500 error when fetching tasks",
        userId: testUserId,
        projectId: project1.id,
        containerId: project1ContainerMap["Done"], // ✅ Assigned to Done
        priority: "MEDIUM",
        status: "DONE",
        difficulty: "MODERATE",
      },

      // Project 2 Tasks
      {
        title: "Workout Session",
        description: "Morning yoga and stretching",
        userId: testUserId,
        projectId: project2.id,
        containerId: project2ContainerMap["To-Do"], // ✅ Assigned to To-Do
        priority: "MEDIUM",
        status: "NEXT",
        difficulty: "EASY",
      },
      {
        title: "Meal Prep",
        description: "Prepare healthy meals for the week",
        userId: testUserId,
        projectId: project2.id,
        containerId: project2ContainerMap["In Progress"], // ✅ Assigned to In Progress
        priority: "LOW",
        status: "IN_PROGRESS",
        difficulty: "EASY",
      },
      {
        title: "Evening Walk",
        description: "Go for a 30-minute walk",
        userId: testUserId,
        projectId: project2.id,
        containerId: project2ContainerMap["Done"], // ✅ Assigned to Done
        priority: "LOWEST",
        status: "DONE",
        difficulty: "VERY_EASY",
      },

      // Area 1 (General Work Tasks not assigned to a Project)
      {
        title: "Prepare Report",
        description: "Compile monthly work performance data",
        userId: testUserId,
        areaId: area1.id,
        containerId: area1ContainerMap["To-Do"], // ✅ Assigned to Area To-Do
        priority: "HIGH",
        status: "WAITING",
        difficulty: "MODERATE",
      },
      {
        title: "Email Clients",
        description: "Respond to pending emails",
        userId: testUserId,
        areaId: area1.id,
        containerId: area1ContainerMap["In Progress"], // ✅ Assigned to Area In Progress
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        difficulty: "EASY",
      },

      // Area 2 (General Personal Tasks not assigned to a Project)
      {
        title: "Grocery Shopping",
        description: "Buy fruits, vegetables, and milk",
        userId: testUserId,
        areaId: area2.id,
        containerId: area2ContainerMap["To-Do"], // ✅ Assigned to Area To-Do
        priority: "MEDIUM",
        status: "NEXT",
        difficulty: "EASY",
      },
      {
        title: "Read a Book",
        description: "Finish the last chapter of 'Atomic Habits'",
        userId: testUserId,
        areaId: area2.id,
        containerId: area2ContainerMap["Done"], // ✅ Assigned to Area Done
        priority: "LOW",
        status: "DONE",
        difficulty: "EASY",
      },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
