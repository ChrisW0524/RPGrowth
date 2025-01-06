import React, { useState, useRef, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa"; // Import the arrow icon
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { ListButton } from "./ListButton";

import { UniqueIdentifier } from "@dnd-kit/core";

interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: () => void;
}

const ListContainer = ({
  id,
  children,
  title,
  description,
  onAddItem,
}: ContainerProps) => {
  // Accordion toggle state
  const [isOpen, setIsOpen] = useState(true);

  // Ref to calculate height for animation
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState("auto");

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, children]); // Recalculate on toggle or when children change

  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  });

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "flex h-full w-full flex-col gap-y-4 rounded-xl p-4",
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
              className="p-1  transition-colors duration-300 hover:bg-gray-100 rounded-md"
            >
              <FaAngleRight
                className={clsx(
                  "text-gray-800 transition-transform duration-300", // Smooth rotation transition
                  isOpen && "rotate-90" // Rotate 90 degrees counterclockwise when open
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

        <div className="w-full border-b-2 border-gray-300"></div>
      </div>

      {/* Collapsible Content with Animation */}
      <div
        ref={contentRef}
        style={{
          height: contentHeight,
          overflow: "hidden",
          transition: "height 0.3s ease-in-out",
        }}
      >
        <div className="flex flex-col gap-y-4 pt-4">
          {children}
          <ListButton variant="ghost" onClick={onAddItem}>
            Add Item
          </ListButton>
        </div>
      </div>
    </div>
  );
};

export default ListContainer;
