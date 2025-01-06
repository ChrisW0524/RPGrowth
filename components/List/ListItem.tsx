import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { KanbanItemType } from "@/types";

import { Checkbox } from "@material-tailwind/react";

const ListItem = ({ id, title }: KanbanItemType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
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
        "w-full cursor-pointer rounded-xl bg-white",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox
          
          />
          {title}
        </div>
        <button
          className="rounded-xl border p-2 text-xs"
          {...listeners}
        >
          Drag Handle
        </button>
      </div>
    </div>
  );
};

export default ListItem;
