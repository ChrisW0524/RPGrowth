"use client";

import { useState } from "react";
import { Bell, Settings, User } from "lucide-react";

// Components
import Sidebar, { SidebarItem } from "@/components/Sidebar";
import KanbanBoard from "@/components/Kanban/KanbanBoard";
import ListBoard from "@/components/List/ListBoard";

// Types
import { Area, Project, Container } from "@/types";

// Sample Data
import { sampleAreas } from "@/testData";

export default function Home() {
  // Toggle between Kanban/List
  const [isKanbanView, setIsKanbanView] = useState(true);
  const toggleView = () => setIsKanbanView((prev) => !prev);

  // All areas in state
  const [areas, setAreas] = useState<Area[]>(sampleAreas);

  // Which area & project the user is viewing
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Build containers to display
  let displayedContainers: Container[] = [];

  const selectedArea = areas.find((a) => a.id === selectedAreaId);

  if (selectedArea) {
    if (selectedProjectId) {
      // If user selected a project
      const project = selectedArea.projects.find((p) => p.id === selectedProjectId);
      displayedContainers = project ? project.containers : [];
    } else {
      // No project selected => area-level containers
      displayedContainers = selectedArea.containers;
    }
  }

  /**
   * This is the critical function:
   *  We replace the containers in the currently viewed project or area.
   */
  function handleSetContainers(newContainers: Container[]) {

    console.log("changing areas")
    console.log(newContainers)

    setAreas((oldAreas) =>
      oldAreas.map((area) => {
        if (area.id !== selectedAreaId) {
          // If it's not the selected area, return as is
          return area;
        }

        // If the user is viewing a specific project
        if (selectedProjectId) {
          console.log("project")
          return {
            ...area,
            projects: area.projects.map((proj) => {
              if (proj.id !== selectedProjectId) return proj;
              return {
                ...proj,
                // Override the containers with newContainers
                containers: newContainers,
              };
            }),
          };
        } else {
          console.log("not project")
          // Otherwise, update area-level containers
          return {
            ...area,
            containers: newContainers,
          };
        }
      })
    );
  }

  console.log(areas)

  console.log(displayedContainers)

  return (
    <div className="flex w-screen">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem icon={<Bell size={20} />} text="Notifications" alert />
        <SidebarItem icon={<User size={20} />} text="Profile" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
      </Sidebar>

      <div className="flex-1 p-4">
        {/* Top row controls: area and project dropdowns, plus toggle view button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 items-center">
            {/* Area Selector */}
            <div>
              <label className="mr-2">Area:</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedAreaId}
                onChange={(e) => {
                  setSelectedAreaId(e.target.value);
                  setSelectedProjectId(null); // reset project if area changes
                }}
              >
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Selector */}
            <div>
              <label className="mr-2">Project:</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedProjectId ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedProjectId(val === "" ? null : val);
                }}
              >
                <option value="">-- None --</option>
                {selectedArea?.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={toggleView}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {isKanbanView ? "Switch to List View" : "Switch to Board View"}
          </button>
        </div>

        {/* Render Board */}
        {isKanbanView ? (
          <KanbanBoard containers={displayedContainers} setContainers={handleSetContainers} />
        ) : (
          <ListBoard containers={displayedContainers} setContainers={handleSetContainers} />
        )}
      </div>
    </div>
  );
}
