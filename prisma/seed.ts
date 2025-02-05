import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1️⃣ Create a test user (Replace with real Clerk userId later)
  const testUserId = "user_2sQLgnrja0dYRnMPpkIKX62Vw0n"; // usedID of my personal email

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

  // 4️⃣ Create sample Containers (Columns in Kanban)
  const container1 = await prisma.container.create({
    data: { name: "To-Do", userId: testUserId, projectId: project1.id },
  });

  const container2 = await prisma.container.create({
    data: { name: "In Progress", userId: testUserId, projectId: project1.id },
  });

  // 5️⃣ Create sample Tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Implement Login",
        description: "Set up Clerk authentication",
        userId: testUserId,
        projectId: project1.id,
        containerId: container1.id,
        priority: "HIGH",
        status: "IN_PROGRESS",
        difficulty: "MODERATE",
      },
      {
        title: "Workout Session",
        description: "Morning yoga and stretching",
        userId: testUserId,
        projectId: project2.id,
        containerId: container2.id,
        priority: "MEDIUM",
        status: "NEXT",
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
