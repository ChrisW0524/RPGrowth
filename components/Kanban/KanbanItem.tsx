import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { TaskType } from "@/types";

export default function KanbanItem(props: TaskType) {
  const { id, title, description, priority, status, createdDate, completedDate, dueDate, exp, gold, tags } = props;

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
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer",
        isDragging && "opacity-50",
      )}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          Drag Handle
        </button>
      </div>

      {/* Description */}
      <p className="mt-1 text-sm text-gray-600">{description}</p>

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
  );
}
