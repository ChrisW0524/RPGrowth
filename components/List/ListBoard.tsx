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
import ListContainer from "./ListContainer";
import ListItem from "./ListItem";
import Modal from "../Modal";
import Input from "../Input";
import { Button } from "../Button";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  containers: TaskContainerType[];
  setContainers: React.Dispatch<React.SetStateAction<TaskContainerType[]>>;
}

export default function ListBoard({ containers, setContainers }: Props) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // modals for container/task
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [containerName, setContainerName] = useState("");

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();

  // fields for new task
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [taskStatus, setTaskStatus] = useState<"To Do" | "In Progress" | "Completed">("To Do");
  const [taskExp, setTaskExp] = useState<number>(0);
  const [taskGold, setTaskGold] = useState<number>(0);
  const [taskDueDate, setTaskDueDate] = useState<string>("");

  const onAddContainer = () => {
    if (!containerName.trim()) return;
    const newContainer: TaskContainerType = {
      id: `container-${uuidv4()}`,
      title: containerName,
      items: [],
    };
    setContainers([...containers, newContainer]);
    setContainerName("");
    setShowAddContainerModal(false);
  };

  const onAddItem = () => {
    if (!taskTitle.trim() || !currentContainerId) return;

    const containerIndex = containers.findIndex((c) => c.id === currentContainerId);
    if (containerIndex === -1) return;

    const newTask: TaskType = {
      id: `item-${uuidv4()}`,
      title: taskTitle,
      description: taskDescription,
      tags: [],
      priority: taskPriority,
      status: taskStatus,
      createdDate: dayjs(),
      dueDate: taskDueDate ? dayjs(taskDueDate) : undefined,
      exp: taskExp,
      gold: taskGold,
    };

    const updated = [...containers];
    updated[containerIndex].items.push(newTask);
    setContainers(updated);

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

  // find container by id
  const findContainer = (id: UniqueIdentifier) => containers.find((c) => c.id === id);
  // find container that has the item
  const findItemContainer = (itemId: UniqueIdentifier) =>
    containers.find((c) => c.items.find((i) => i.id === itemId));

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // DnD handlers
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragMove(event: DragMoveEvent) {
    // real-time reordering if desired
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    // container -> container reordering
    if (String(active.id).includes("container") && String(over.id).includes("container")) {
      const oldIndex = containers.findIndex((c) => c.id === active.id);
      const newIndex = containers.findIndex((c) => c.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return;
      const reordered = arrayMove(containers, oldIndex, newIndex);
      setContainers(reordered);
    }

    // item -> item or item -> container
    if (String(active.id).includes("item")) {
      const fromContainer = findItemContainer(active.id);
      const toContainer = String(over.id).includes("item")
        ? findItemContainer(over.id)
        : findContainer(over.id);

      if (!fromContainer || !toContainer) return;

      const fromIndex = containers.findIndex((c) => c.id === fromContainer.id);
      const toIndex = containers.findIndex((c) => c.id === toContainer.id);

      const activeTaskIndex = fromContainer.items.findIndex((i) => i.id === active.id);

      let overIndex = 0;
      if (String(over.id).includes("item")) {
        overIndex = toContainer.items.findIndex((i) => i.id === over.id);
      } else {
        overIndex = toContainer.items.length; // push to end
      }

      const updated = [...containers];
      const [movedItem] = updated[fromIndex].items.splice(activeTaskIndex, 1);
      updated[toIndex].items.splice(overIndex, 0, movedItem);

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

      {/* Add Item Modal */}
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
          {/* Priority & Status */}
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
        <h1 className="text-3xl font-bold text-gray-800">List Board</h1>
        <Button onClick={() => setShowAddContainerModal(true)}>Add Container</Button>
      </div>

      {/* Render List Containers */}
      <div className="mt-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={containers.map((c) => c.id)}>
            <div className="flex flex-col gap-6">
              {containers.map((container) => (
                <ListContainer
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
                        <ListItem key={task.id} {...task} />
                      ))}
                    </div>
                  </SortableContext>
                </ListContainer>
              ))}
            </div>
          </SortableContext>

          <DragOverlay adjustScale={false}>
            {activeId && String(activeId).includes("item") && (() => {
              const c = findItemContainer(activeId);
              if (!c) return null;
              const t = c.items.find((x) => x.id === activeId);
              if (!t) return null;
              return <ListItem {...t} />;
            })()}
            {activeId && String(activeId).includes("container") && (() => {
              const c = findContainer(activeId);
              if (!c) return null;
              return (
                <ListContainer id={c.id} title={c.title}>
                  {c.items.map((x) => (
                    <ListItem key={x.id} {...x} />
                  ))}
                </ListContainer>
              );
            })()}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
