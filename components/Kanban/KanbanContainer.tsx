import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { UniqueIdentifier } from "@dnd-kit/core";

interface ContainerProps {
  id: UniqueIdentifier;
  title?: string;
  children: React.ReactNode;
  onAddItem?: () => void;
}

export default function KanbanContainer({
  id,
  title,
  children,
  onAddItem,
}: ContainerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "container",
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "w-full h-full p-4 bg-gray-50 rounded-xl flex flex-col gap-y-4",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          Drag Handle
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-y-4">{children}</div>

      <button
        className="text-blue-600 hover:underline text-sm"
        onClick={onAddItem}
      >
        + Add Item
      </button>
    </div>
  );
}
