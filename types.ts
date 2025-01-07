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

export interface TaskType {
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
}

// For your container, reference TaskType in items:
export interface ContainerType {
  id: Id
  title: string;
  items: TaskType[];
}