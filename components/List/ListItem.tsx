import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { TaskType } from "@/types";

import { Checkbox } from "@material-tailwind/react";

const ListItem = (props: TaskType) => {
  const {
    id,
    title,
    description,
    priority,
    status,
    createdDate,
    completedDate,
    dueDate,
    exp,
    gold,
    tags,
  } = props;

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
          <Checkbox />
          {title}
        </div>
        <button className="rounded-xl border p-2 text-xs" {...listeners}>
          Drag Handle
        </button>
      </div>

      {/* Additional fields
      <div className="mt-2 space-y-1 text-xs text-gray-500">
        <div>
          <strong>Priority:</strong> {priority}
        </div>
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Created:</strong> {createdDate.format("YYYY-MM-DD")}
        </div>
        {completedDate && (
          <div>
            <strong>Completed:</strong> {completedDate.format("YYYY-MM-DD")}
          </div>
        )}
        {dueDate && (
          <div>
            <strong>Due:</strong> {dueDate.format("YYYY-MM-DD")}
          </div>
        )}
        {exp !== undefined && (
          <div>
            <strong>EXP:</strong> {exp}
          </div>
        )}
        {gold !== undefined && (
          <div>
            <strong>Gold:</strong> {gold}
          </div>
        )}
        {!!tags?.length && (
          <div>
            <strong>Tags:</strong>{" "}
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="mr-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
};

export default ListItem;
