import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { TaskType } from "@/types";
import { Checkbox } from "@material-tailwind/react";

export default function ListItem(props: TaskType) {
  const {
    id,
    title,
    description,
    tags,
    priority,
    status,
    createdDate,
    completedDate,
    dueDate,
    exp,
    gold,
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type: "item" },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={clsx(
        "w-full cursor-pointer rounded-xl bg-white p-3 border hover:shadow-md",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <Checkbox />
          <div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>

            {/* Additional fields */}
            <div className="mt-2 text-xs text-gray-500 space-y-1">
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
            </div>
          </div>
        </div>

        <button className="rounded-xl border p-2 text-xs" {...listeners}>
          Drag
        </button>
      </div>
    </div>
  );
}
