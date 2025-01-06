import React, { useState, useRef, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "../Button";
import { UniqueIdentifier } from "@dnd-kit/core";

interface ContainerProps {
  id: UniqueIdentifier;
  title: string;
  children: React.ReactNode;
  onAddItem?: () => void;
}

export default function ListContainer({ id, title, children, onAddItem }: ContainerProps) {
  // Accordion toggle
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState("auto");

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, children]);

  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
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
      className={clsx("flex w-full flex-col gap-y-4 rounded-xl", isDragging && "opacity-50")}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 transition-colors duration-300 hover:bg-gray-100 rounded-md"
          >
            <FaAngleRight
              className={clsx(
                "text-gray-800 transition-transform duration-300",
                isOpen && "rotate-90"
              )}
            />
          </button>
          {/* Title */}
          <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
        </div>

        {/* Drag Handle */}
        <button className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl" {...listeners}>
          Drag Handle
        </button>
      </div>

      <div className="w-full border-b-2 border-gray-300" />

      {/* Collapsible Content */}
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
          <Button variant="ghost" onClick={onAddItem}>
            + Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}
