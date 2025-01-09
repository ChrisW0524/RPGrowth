import React, { useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "../Button";
import { UniqueIdentifier } from "@dnd-kit/core";

interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: () => void;
}

export default function ListContainer({
  id,
  children,
  title,
  description,
  onAddItem,
}: ContainerProps) {
  // Accordion toggle
  const [isOpen, setIsOpen] = useState(true);

  const { attributes, setNodeRef, listeners, transform, transition, isDragging } =
    useSortable({
      id: id,
      data: { type: "container" },
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
        "flex h-full w-full flex-col gap-y-4 rounded-xl",
        isDragging && "opacity-50",
      )}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Arrow Icon for Expand/Collapse */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-md p-1 transition-colors duration-300 hover:bg-gray-100"
            >
              <FaAngleRight
                className={clsx(
                  "text-gray-800 transition-transform duration-300", 
                  isOpen && "rotate-90" // rotate arrow when open
                )}
              />
            </button>

            {/* Title and Description */}
            <div className="flex flex-col gap-y-1">
              <h1 className="font-bold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>

          {/* Drag Handle */}
          <button
            className="rounded-xl border p-2 text-xs shadow-lg hover:shadow-xl"
            {...listeners}
          >
            Drag Handle
          </button>
        </div>

        <div className="w-full border-b-2 border-gray-300" />
      </div>

      {/* Collapsible Content */}
      <div
        className={clsx(
          // Basic container styles
          "flex flex-col gap-y-4 pt-4 overflow-hidden transition-all duration-300",
          // When isOpen, set a large max height
          // When closed, max height is 0
          isOpen ? "max-h-[1000px]" : "max-h-0",
        )}
      >
        {children}
        <Button variant="ghost" onClick={onAddItem}>
          Add Item
        </Button>
      </div>
    </div>
  );
}
