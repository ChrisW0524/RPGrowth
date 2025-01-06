import { UniqueIdentifier } from '@dnd-kit/core';
import type { Dayjs } from 'dayjs';

export type Id = string | number


export type Column = {
    id: Id;
    title: string
}

export interface TaskType {
  id: UniqueIdentifier;                // Unique identifier for each task
  title: string;                       // Short description of the task
  description?: string;                 // Detailed explanation of the task
  tags?: string[];                     // Keywords or categories for organization
  priority?: "High" | "Medium" | "Low"; // Level of importance
  status?: "To Do" | "In Progress" | "Completed"; // Current state
  createdDate: Dayjs;                  // Timestamp of creation or last update
  completedDate?: Dayjs;               // Timestamp of when task was completed
  dueDate?: Dayjs;                     // Due date/time
  exp?: number;                        // Experience points awarded upon completion
  gold?: number;                       // Gold awarded upon completion
}

export interface TaskContainerType {
  id: UniqueIdentifier;
  title: string;
  items: TaskType[];
}

