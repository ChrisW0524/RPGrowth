"use client";

import React, { useState, ReactNode } from "react";
import { MoreVertical, ChevronLast, ChevronFirst, Folder } from "lucide-react";
import clsx from "clsx";
import { Area, Project } from "@/types";

interface SidebarProps {
  areas: Area[];
  // Callback: user clicked "main" (optional)
  onSelectMain?: () => void;
  // User clicked an area
  onSelectArea?: (areaId: string) => void;
  // User clicked a project
  onSelectProject?: (areaId: string, projectId: string) => void;

  // Currently "active" area and project IDs
  selectedAreaId?: string;
  selectedProjectId?: string;
}

/**
 * A Sidebar where:
 * - We list all areas.
 * - Clicking an area expands/collapses that area to show its projects.
 * - Clicking a project selects that project.
 */
export default function Sidebar({
  areas,
  onSelectMain,
  onSelectArea,
  onSelectProject,
  selectedAreaId,
  selectedProjectId,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  /**
   * We'll keep local state that tracks which area is "open"
   * (i.e. showing its project sub-list). If you want only ONE area open
   * at a time, store a single string. If you want multiple open, store an array.
   */
  const [openAreaId, setOpenAreaId] = useState<string | null>(null);

  // Handler to toggle an area’s expansion
  function toggleArea(areaId: string) {
    setOpenAreaId((current) => (current === areaId ? null : areaId));
  }

  return (
    <aside className="h-screen w-fit border-r bg-white shadow-sm">
      <nav className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          {/* Example logo */}
          <img
            src="https://img.logoipsum.com/243.svg"
            alt="Logo"
            className={clsx("overflow-hidden transition-all", expanded ? "w-32" : "w-0")}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="rounded-lg bg-gray-50 p-1.5 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-2 overflow-y-auto">
          {/* Main Tab (optional) */}
          {onSelectMain && (
            <>
              <SidebarItem
                icon={<Folder size={20} />}
                text="Main"
                active={!selectedAreaId && !selectedProjectId}
                onClick={() => onSelectMain()}
                expanded={expanded}
              />
              <hr className="my-2 border-gray-200" />
            </>
          )}

          {/* List of Areas */}
          {areas.map((area) => {
            const isAreaActive = area.id === selectedAreaId && !selectedProjectId;
            const isAreaOpen = openAreaId === area.id; // is this area expanded?
            const areaHasProjects = area.projects?.length > 0;

            return (
              <div key={area.id} className="mb-2">
                {/* AREA ITEM */}
                <SidebarItem
                  icon={<Folder size={20} />}
                  text={area.name}
                  active={isAreaActive}
                  expanded={expanded}
                  // Clicking area:
                  //  1) expand/collapse local sub-list
                  //  2) call onSelectArea if provided
                  onClick={() => {
                    toggleArea(area.id);
                    onSelectArea?.(area.id);
                  }}
                />

                {/* SUB-LIST OF PROJECTS, only visible if area is open */}
                {areaHasProjects && isAreaOpen && (
                  <div className="ml-6 mt-1 border-l pl-3">
                    {area.projects.map((proj) => {
                      // If user is on this project
                      const isProjectActive = selectedProjectId === proj.id;
                      const totalTasks = (proj.containers ?? []).reduce(
                        (sum, c) => sum + c.items.length,
                        0
                      );
                      const completedTasks = (proj.containers ?? []).reduce(
                        (sum, c) =>
                          sum +
                          c.items.filter((task) => task.status === "Completed").length,
                        0
                      );
                      const progressPct =
                        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                      return (
                        <div key={proj.id} className="mb-1">
                          <SidebarItem
                            icon={<Folder size={18} />}
                            text={proj.name}
                            active={isProjectActive}
                            expanded={expanded}
                            // When user clicks a project
                            onClick={() => {
                              onSelectProject?.(area.id, proj.id);
                            }}
                          />
                          {/* Show progress bar if project is active & expanded */}
                          {isProjectActive && expanded && (
                            <div className="mx-3 mb-2 h-2 rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-indigo-500 transition-all"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center p-3 border-t">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="Avatar"
            className="h-10 w-10 rounded-md"
          />
          <div
            className={clsx(
              "ml-3 flex items-center justify-between overflow-hidden transition-all",
              expanded ? "w-40" : "w-0"
            )}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

/** 
 * Single SidebarItem 
 */
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  expanded: boolean; // whether sidebar is expanded
  onClick?: () => void;
}

function SidebarItem({ icon, text, active, expanded, onClick }: SidebarItemProps) {
  return (
    <div
      className={clsx(
        "group relative my-1 flex cursor-pointer items-center rounded-md py-2 px-3 font-medium transition-colors",
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      )}
      onClick={onClick}
    >
      {icon}
      {/* Text label (hidden if collapsed) */}
      <span
        className={clsx(
          "overflow-hidden transition-all",
          expanded ? "ml-3 w-52" : "w-0"
        )}
      >
        {text}
      </span>
      {/* Tooltip if collapsed */}
      {!expanded && (
        <div
          className={clsx(
            "invisible absolute left-full ml-6 rounded-md bg-indigo-100 px-2 py-1 text-sm text-indigo-800 opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
          )}
        >
          {text}
        </div>
      )}
    </div>
  );
}
