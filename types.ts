import dayjs, { Dayjs } from "dayjs";

export type Id = string | number

export type Column = {
    id: Id;
    title: string
}

export type Type = {
  id: Id;
  title: string;
};

export interface Task {
  id: Id
  title: string;
  description: string;
  tags?: string[];
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Completed";
  createdDate: Dayjs;
  completedDate?: Dayjs;
  dueDate?: Dayjs;
  exp?: number;
  gold?: number;

  projectId: Id;
  areaId: Id;
}

// For your container, reference TaskType in items:
export interface Container {
  id: Id
  name: string;
  tasks: Task[];
}

export interface Area {
  id: Id;
  name: string;       // e.g. "Academics", "Finances", "Health"
  containers: Container[];
  projects: Project[];
}

export interface Project {
  id: Id;
  name: string;        // e.g. "Math Homework", "Budget Planning"
  areaId: Id;      // which area it belongs to
  containers: Container[];
}

