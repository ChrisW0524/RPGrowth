"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// DnD
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

// Components
import KanbanContainer from "@/components/Kanban/KanbanContainer";
import KanbanItem from "@/components/Kanban/KanbanItem";
import Modal from "./Modal"; 
import Input from "./Input";
import { Button } from "./Button";
import { Task } from "@/types";
import dayjs from "dayjs";
const inter = Inter({ subsets: ["latin"] });

import type { Container } from "@/types";
import { p } from "framer-motion/client";
import ListItem from "./List/ListItem";
import ListContainer from "./List/ListContainer";

interface Props {
  containers: Container[];
  setContainers: (newContainers: Container[]) => void;
  isKanbanView: boolean;
}

export default function TaskBoard({
  containers,
  setContainers,
  isKanbanView,
}: Props) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
  const [containerName, setContainerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Fields for a new task
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">(
    "Medium",
  );
  const [taskStatus, setTaskStatus] = useState<
    "To Do" | "In Progress" | "Completed"
  >("To Do");
  const [taskExp, setTaskExp] = useState<number>(0);
  const [taskGold, setTaskGold] = useState<number>(0);
  const [taskDueDate, setTaskDueDate] = useState<string>(""); // will convert to dayjs

  console.log(containers)

  const onAddContainer = () => {
    if (!containerName) return;
    setContainers([
      ...containers,
      {
        id: `container-${uuidv4()}`,
        name: containerName,
        tasks: [],
      },
    ]);
    setContainerName("");
    setShowAddContainerModal(false);
  };

  // -- Add a new item
  const onAddItem = () => {
    if (!taskTitle.trim() || !currentContainerId) return;

    // find container
    const containerIndex = containers.findIndex(
      (c) => c.id === currentContainerId,
    );
    if (containerIndex === -1) return;

    const newTask: Task = {
      id: `task-${uuidv4()}`,
      title: taskTitle,
      description: taskDescription,
      tags: [], // you can store this from user input if you want
      priority: taskPriority,
      status: taskStatus,
      createdDate: dayjs(),
      dueDate: taskDueDate ? dayjs(taskDueDate) : undefined,
      exp: taskExp,
      gold: taskGold,
      // TODO REPLACE
      projectId: 0,
      areaId: 0,
    };

    const updatedContainers = [...containers];
    updatedContainers[containerIndex].tasks.push(newTask);
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

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return containers.find((item) => item.id === id);
    }
    if (type === "item") {
      return containers.find((container) =>
        container.tasks.find((item) => item.id === id),
      );
    }
  }

  const findItem = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.tasks.find((item) => item.id === id);
    if (!item) return "";
    return item;
  };

  const findContainerName = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.name;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return [];
    return container.tasks;
  };

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    console.log(active, over);

    // Handle Items Sorting
    if (
      active.id.toString().includes("task") &&
      over?.id.toString().includes("task") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tasks.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.tasks.findIndex(
        (item) => item.id === over.id,
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].tasks = arrayMove(
          newItems[activeContainerIndex].tasks,
          activeitemIndex,
          overitemIndex,
        );

        setContainers(newItems);
      } else {
        // In different containers
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].tasks.splice(
          activeitemIndex,
          1,
        );
        newItems[overContainerIndex].tasks.splice(
          overitemIndex,
          0,
          removeditem,
        );
        setContainers(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes("task") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tasks.findIndex(
        (item) => item.id === active.id,
      );

      // Remove the active item from the active container and add it to the over container
      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].tasks.splice(
        activeitemIndex,
        1,
      );
      newItems[overContainerIndex].tasks.push(removeditem);
      setContainers(newItems);
    }
  };

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id,
      );

      console.log(activeContainerIndex, overContainerIndex);

      // Swap the active and over container
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      console.log(containers);
      console.log(newItems);
      setContainers(newItems);
    }

    // Handling item Sorting
    if (
      active.id.toString().includes("task") &&
      over?.id.toString().includes("task") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tasks.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.tasks.findIndex(
        (item) => item.id === over.id,
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].tasks = arrayMove(
          newItems[activeContainerIndex].tasks,
          activeitemIndex,
          overitemIndex,
        );
        setContainers(newItems);
      } else {
        // In different containers
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].tasks.splice(
          activeitemIndex,
          1,
        );
        newItems[overContainerIndex].tasks.splice(
          overitemIndex,
          0,
          removeditem,
        );
        setContainers(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes("task") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tasks.findIndex(
        (item) => item.id === active.id,
      );

      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].tasks.splice(
        activeitemIndex,
        1,
      );
      newItems[overContainerIndex].tasks.push(removeditem);
      setContainers(newItems);
    }
    setActiveId(null);
  }

  return (
    <div className="flex-1 p-8">
      {/* Add Container Modal */}
      <Modal
        showModal={showAddContainerModal}
        setShowModal={setShowAddContainerModal}
      >
        <div className="flex w-full flex-col items-start gap-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Add Container</h1>
          <Input
            type="text"
            placeholder="Container Title"
            name="containername"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
          />
          <Button onClick={onAddContainer}>Add container</Button>
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
          {/* Priority & Status (basic selects) */}
          <select
            value={taskPriority}
            onChange={(e) =>
              setTaskPriority(e.target.value as "High" | "Medium" | "Low")
            }
            className="w-full rounded-lg border p-2 shadow-lg hover:shadow-xl"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={taskStatus}
            onChange={(e) =>
              setTaskStatus(
                e.target.value as "To Do" | "In Progress" | "Completed",
              )
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
      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Dnd-kit Guide</h1>
        <Button onClick={() => setShowAddContainerModal(true)}>
          Add Container
        </Button>
      </div>
      {isKanbanView ? (
        <div className="mt-10">
          <div className="grid grid-cols-3 gap-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={(containers ?? []).map((i) => i.id)}>
                {(containers ?? []).map((container) => (
                  <KanbanContainer
                    id={container.id}
                    title={container.name}
                    key={container.id}
                    onAddItem={() => {
                      setShowAddItemModal(true);
                      setCurrentContainerId(container.id);
                    }}
                  >
                    <SortableContext items={container.tasks.map((i) => i.id)}>
                      <div className="flex flex-col items-start gap-y-4">
                        {container.tasks.map((i) => (
                          <KanbanItem {...i} key={i.id} />
                        ))}
                      </div>
                    </SortableContext>
                  </KanbanContainer>
                ))}
              </SortableContext>
              <DragOverlay adjustScale={false}>
                {/* Drag Overlay For item Item */}
                {activeId && activeId.toString().includes("task") && (
                  <KanbanItem id={activeId} {...findItem(activeId)} />
                )}
                {/* Drag Overlay For Container */}
                {activeId && activeId.toString().includes("container") && (
                  <KanbanContainer
                    id={activeId}
                    title={findContainerName(activeId)}
                  >
                    {findContainerItems(activeId).map((i) => (
                      <KanbanItem {...i} key={i.id} />
                    ))}
                  </KanbanContainer>
                )}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <div className="flex flex-col gap-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={(containers ?? []).map((i) => i.id)}>
                {containers.map((container) => (
                  <ListContainer
                    id={container.id}
                    title={container.name}
                    key={container.id}
                    onAddItem={() => {
                      setShowAddItemModal(true);
                      setCurrentContainerId(container.id);
                    }}
                  >
                    <SortableContext items={container.tasks.map((i) => i.id)}>
                      <div className="flex flex-col items-start gap-y-4">
                        {container.tasks.map((i) => (
                          <ListItem {...i} key={i.id} />
                        ))}
                      </div>
                    </SortableContext>
                  </ListContainer>
                ))}
              </SortableContext>
              <DragOverlay adjustScale={false}>
                {/* Drag Overlay For item Item */}
                {activeId && activeId.toString().includes("task") && (
                  <ListItem id={activeId} {...findItem(activeId)} />
                )}
                {/* Drag Overlay For Container */}
                {activeId && activeId.toString().includes("container") && (
                  <ListContainer
                    id={activeId}
                    title={findContainerName(activeId)}
                  >
                    {findContainerItems(activeId).map((i) => (
                      <ListItem {...i} key={i.id} />
                    ))}
                  </ListContainer>
                )}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
}
