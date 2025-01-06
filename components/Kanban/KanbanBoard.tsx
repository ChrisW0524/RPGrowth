"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

// dnd-kit
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { Inter } from "next/font/google";

// Types
import { TaskContainerType, TaskType } from "@/types";

// Components
import Container from "@/components/Kanban/KanbanContainer";
import Item from "@/components/Kanban/KanbanItem";
import Modal from "../Modal";
import Input from "../Input";
import { Button } from "../Button";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  containers: TaskContainerType[];
  setContainers: React.Dispatch<React.SetStateAction<TaskContainerType[]>>;
}

export default function KanbanBoard({ containers, setContainers }: Props) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // -- Manage modals & input states for adding container/task
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [containerName, setContainerName] = useState("");

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();

  // Fields for a new task
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [taskStatus, setTaskStatus] = useState<"To Do" | "In Progress" | "Completed">("To Do");
  const [taskExp, setTaskExp] = useState<number>(0);
  const [taskGold, setTaskGold] = useState<number>(0);
  const [taskDueDate, setTaskDueDate] = useState<string>(""); // will convert to dayjs

  // -- Add a new container
  const onAddContainer = () => {
    if (!containerName.trim()) return;
    const newContainer: TaskContainerType = {
      id: `container-${uuidv4()}`,
      title: containerName,
      items: [], // starts empty
    };
    setContainers([...containers, newContainer]);
    setContainerName("");
    setShowAddContainerModal(false);
  };

  // -- Add a new item
  const onAddItem = () => {
    if (!taskTitle.trim() || !currentContainerId) return;

    // find container
    const containerIndex = containers.findIndex((c) => c.id === currentContainerId);
    if (containerIndex === -1) return;

    const newTask: TaskType = {
      id: `item-${uuidv4()}`,
      title: taskTitle,
      description: taskDescription,
      tags: [], // you can store this from user input if you want
      priority: taskPriority,
      status: taskStatus,
      createdDate: dayjs(),
      dueDate: taskDueDate ? dayjs(taskDueDate) : undefined,
      exp: taskExp,
      gold: taskGold,
    };

    const updatedContainers = [...containers];
    updatedContainers[containerIndex].items.push(newTask);
    setContainers(updatedContainers);

    // reset fields
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("Medium");
    setTaskStatus("To Do");
    setTaskExp(0);
    setTaskGold(0);
    setTaskDueDate("");
    setShowAddItemModal(false);
  };

  // Utility to find container or item by id
  const findContainer = (id: UniqueIdentifier) =>
    containers.find((c) => c.id === id);
  const findItemContainer = (itemId: UniqueIdentifier) =>
    containers.find((c) => c.items.find((i) => i.id === itemId));

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // DnD Handlers
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragMove(event: DragMoveEvent) {
    const { active, over } = event;
    if (!over) return;
    // If you're doing real-time reordering in "onDragMove", you can do it here.
    // Otherwise, you can do it in handleDragEnd alone.
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    // Container -> Container reordering
    if (String(active.id).includes("container") && String(over.id).includes("container")) {
      const oldIndex = containers.findIndex((c) => c.id === active.id);
      const newIndex = containers.findIndex((c) => c.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return;

      const newContainers = arrayMove(containers, oldIndex, newIndex);
      setContainers(newContainers);
    }

    // Item -> Item or Item -> Container reordering
    if (String(active.id).includes("item")) {
      const fromContainer = findItemContainer(active.id);
      const toContainer = String(over.id).includes("item")
        ? findItemContainer(over.id)
        : findContainer(over.id);

      if (!fromContainer || !toContainer) return;

      const fromContainerIndex = containers.findIndex((c) => c.id === fromContainer.id);
      const toContainerIndex = containers.findIndex((c) => c.id === toContainer.id);

      const activeTaskIndex = fromContainer.items.findIndex((i) => i.id === active.id);

      // If over is an item, we need that index:
      let overIndex = 0;
      if (String(over.id).includes("item")) {
        overIndex = toContainer.items.findIndex((i) => i.id === over.id);
      } else {
        // If over is container, push to the end
        overIndex = toContainer.items.length;
      }

      // 1) Remove from old container
      const updated = [...containers];
      const [movedTask] = updated[fromContainerIndex].items.splice(activeTaskIndex, 1);

      // 2) Insert into new container
      updated[toContainerIndex].items.splice(overIndex, 0, movedTask);

      setContainers(updated);
    }

    setActiveId(null);
  }

  return (
    <div className="flex-1 p-8">
      {/* Add Container Modal */}
      <Modal showModal={showAddContainerModal} setShowModal={setShowAddContainerModal}>
        <div className="flex w-full flex-col items-start gap-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Add Container</h1>
          <Input
            type="text"
            placeholder="Container Title"
            name="containerName"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
          />
          <Button onClick={onAddContainer}>Add Container</Button>
        </div>
      </Modal>

      {/* Add Task (Item) Modal */}
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex w-full flex-col items-start gap-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Add Task</h1>
          <Input
            type="text"
            placeholder="Task Title"
            name="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Description"
            name="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Due Date"
            name="taskDueDate"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
          <Input
            type="number"
            placeholder="EXP"
            name="taskExp"
            value={String(taskExp)}
            onChange={(e) => setTaskExp(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Gold"
            name="taskGold"
            value={String(taskGold)}
            onChange={(e) => setTaskGold(Number(e.target.value))}
          />
          {/* Priority & Status (basic selects) */}
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value as "High" | "Medium" | "Low")}
            className="w-full rounded-lg border p-2 shadow-lg hover:shadow-xl"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={taskStatus}
            onChange={(e) =>
              setTaskStatus(e.target.value as "To Do" | "In Progress" | "Completed")
            }
            className="w-full rounded-lg border p-2 shadow-lg hover:shadow-xl"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <Button onClick={onAddItem}>Add Item</Button>
        </div>
      </Modal>

      {/* Page Header */}
      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
        <Button onClick={() => setShowAddContainerModal(true)}>Add Container</Button>
      </div>

      {/* Render Containers */}
      <div className="mt-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={containers.map((c) => c.id)}>
            <div className="grid grid-cols-3 gap-6">
              {containers.map((container) => (
                <Container
                  key={container.id}
                  id={container.id}
                  title={container.title}
                  onAddItem={() => {
                    setCurrentContainerId(container.id);
                    setShowAddItemModal(true);
                  }}
                >
                  <SortableContext items={container.items.map((task) => task.id)}>
                    <div className="flex flex-col items-start gap-y-4">
                      {container.items.map((task) => (
                        <Item
                          key={task.id}
                          {...task} // spread all TaskType fields
                        />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </div>
          </SortableContext>

          {/* Drag Overlay */}
          <DragOverlay adjustScale={false}>
            {activeId && String(activeId).includes("item") && (
              // We need to find the actual Task object
              (() => {
                const c = findItemContainer(activeId);
                if (!c) return null;
                const t = c.items.find((task) => task.id === activeId);
                if (!t) return null;
                return <Item {...t} />;
              })()
            )}
            {activeId && String(activeId).includes("container") && (
              // We need to find the actual Container object
              (() => {
                const c = findContainer(activeId);
                if (!c) return null;
                return (
                  <Container id={c.id} title={c.title}>
                    {c.items.map((task) => (
                      <Item key={task.id} {...task} />
                    ))}
                  </Container>
                );
              })()
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
