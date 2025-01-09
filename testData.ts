import dayjs from "dayjs";
import type { Task, Container, Area, Project } from "@/types";

export const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Complete Chapter 3 Exercises",
    description: "Do math problems from sections 3.1 to 3.5",
    tags: ["study", "math"],
    priority: "High",
    status: "To Do",
    createdDate: dayjs("2025-01-01"),
    dueDate: dayjs("2025-01-05"),
    exp: 10,
    gold: 5,
    areaId: "area-1",
    projectId: "project-1",
  },
  {
    id: "task-2",
    title: "Review monthly budget",
    description: "Check all expenses and income for January",
    tags: ["finance"],
    priority: "Medium",
    status: "In Progress",
    createdDate: dayjs("2025-01-02"),
    exp: 3,
    gold: 2,
    areaId: "area-2",
    projectId: "project-2",
  },
  {
    id: "task-3",
    title: "Morning Jog",
    description: "Run for 30 minutes around the park",
    tags: ["health", "fitness"],
    priority: "Low",
    status: "Completed",
    createdDate: dayjs("2025-01-03"),
    completedDate: dayjs("2025-01-04"),
    dueDate: dayjs("2025-01-04"),
    exp: 2,
    gold: 1,
    areaId: "area-3",
    projectId: "project-3",
  },
  {
    id: "task-4",
    title: "Submit Financial Aid Forms",
    description: "Ensure all documents are completed and uploaded",
    tags: ["paperwork"],
    priority: "High",
    status: "To Do",
    createdDate: dayjs("2025-01-01"),
    areaId: "area-1",
    projectId: "project-2", // or some other if you want
  },
  {
    id: "task-5",
    title: "Plan Semester",
    description: "Create a schedule for classes and study times",
    priority: "Medium",
    status: "To Do",
    createdDate: dayjs("2025-01-05"),
    areaId: "area-1",
    projectId: "none", // if you want a placeholder for tasks not tied to a project
  },
];

//
// Example containers referencing the above tasks
// You can create containers for either area-level or project-level usage
//
export const sampleContainers: Container[] = [
  {
    id: "container-1",
    name: "To Do",
    items: sampleTasks.filter((t) => t.status === "To Do"),
  },
  {
    id: "container-2",
    name: "In Progress",
    items: sampleTasks.filter((t) => t.status === "In Progress"),
  },
  {
    id: "container-3",
    name: "Completed",
    items: sampleTasks.filter((t) => t.status === "Completed"),
  },
];

//
// Example projects that hold their own array of containers
// You can also filter tasks by project ID if you prefer.
//
export const sampleProjects: Project[] = [
  {
    id: "project-1",
    name: "Math Homework",
    areaId: "area-1",
    containers: [
      {
        id: "proj1-todo",
        name: "Project 1 - To Do",
        items: sampleTasks.filter((t) => t.projectId === "project-1" && t.status === "To Do"),
      },
      {
        id: "proj1-inprogress",
        name: "Project 1 - In Progress",
        items: sampleTasks.filter((t) => t.projectId === "project-1" && t.status === "In Progress"),
      },
      {
        id: "proj1-completed",
        name: "Project 1 - Completed",
        items: sampleTasks.filter((t) => t.projectId === "project-1" && t.status === "Completed"),
      },
    ],
  },
  {
    id: "project-2",
    name: "Budget Planning",
    areaId: "area-2",
    containers: [
      {
        id: "proj2-todo",
        name: "Project 2 - To Do",
        items: sampleTasks.filter((t) => t.projectId === "project-2" && t.status === "To Do"),
      },
      {
        id: "proj2-inprogress",
        name: "Project 2 - In Progress",
        items: sampleTasks.filter((t) => t.projectId === "project-2" && t.status === "In Progress"),
      },
      {
        id: "proj2-completed",
        name: "Project 2 - Completed",
        items: sampleTasks.filter((t) => t.projectId === "project-2" && t.status === "Completed"),
      },
    ],
  },
  {
    id: "project-3",
    name: "Morning Workout",
    areaId: "area-3",
    containers: [
      {
        id: "proj3-todo",
        name: "Project 3 - To Do",
        items: sampleTasks.filter((t) => t.projectId === "project-3" && t.status === "To Do"),
      },
      {
        id: "proj3-inprogress",
        name: "Project 3 - In Progress",
        items: sampleTasks.filter((t) => t.projectId === "project-3" && t.status === "In Progress"),
      },
      {
        id: "proj3-completed",
        name: "Project 3 - Completed",
        items: sampleTasks.filter((t) => t.projectId === "project-3" && t.status === "Completed"),
      },
    ],
  },
];

//
// Finally, example areas that each have their own containers array
// plus references to projects
//
export const sampleAreas: Area[] = [
  {
    id: "area-1",
    name: "Academics",
    containers: [
      {
        id: "container-todo",
        name: "Area 1 - To Do",
        items: sampleTasks.filter((t) => t.areaId === "area-1" && t.status === "To Do"),
      },
      {
        id: "container-inprogress",
        name: "Area 1 - In Progress",
        items: sampleTasks.filter((t) => t.areaId === "area-1" && t.status === "In Progress"),
      },
      {
        id: "container-completed",
        name: "Area 1 - Completed",
        items: sampleTasks.filter((t) => t.areaId === "area-1" && t.status === "Completed"),
      },
    ],
    projects: sampleProjects.filter((p) => p.areaId === "area-1"),
  },
  {
    id: "area-2",
    name: "Finances",
    containers: [
      {
        id: "container-todo",
        name: "Area 2 - To Do",
        items: sampleTasks.filter((t) => t.areaId === "area-2" && t.status === "To Do"),
      },
      {
        id: "container-inprogress",
        name: "Area 2 - In Progress",
        items: sampleTasks.filter((t) => t.areaId === "area-2" && t.status === "In Progress"),
      },
      {
        id: "container-completed",
        name: "Area 2 - Completed",
        items: sampleTasks.filter((t) => t.areaId === "area-2" && t.status === "Completed"),
      },
    ],
    projects: sampleProjects.filter((p) => p.areaId === "area-2"),
  },
  {
    id: "area-3",
    name: "Health",
    containers: [
      {
        id: "container-todo",
        name: "Area 3 - To Do",
        items: sampleTasks.filter((t) => t.areaId === "area-3" && t.status === "To Do"),
      },
      {
        id: "container-inprogress",
        name: "Area 3 - In Progress",
        items: sampleTasks.filter((t) => t.areaId === "area-3" && t.status === "In Progress"),
      },
      {
        id: "container-completed",
        name: "Area 3 - Completed",
        items: sampleTasks.filter((t) => t.areaId === "area-3" && t.status === "Completed"),
      },
    ],
    projects: sampleProjects.filter((p) => p.areaId === "area-3"),
  },
];
