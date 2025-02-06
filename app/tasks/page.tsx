"use client";

import { useEffect, useState } from "react";

// Components
import Sidebar from "@/components/Sidebar";
import TaskBoard from "@/components/TaskBoard";

// Types
import { Area, Project, Container } from "@/types";

// Sample Data
// import { sampleAreas } from "@/testData";
import Navbar from "@/components/Navbar";

import { useApi } from "@/utils/api";

export default function Home() {
  const { fetchWithAuth } = useApi();
  
  // Toggle between Kanban/List
  const [isKanbanView, setIsKanbanView] = useState(true);
  const toggleView = () => setIsKanbanView((prev) => !prev);

  // All areas in state
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track selected area / project
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function fetchAreas() {
      try {
        setLoading(true);
        const data = await fetchWithAuth("/api/areas");
        setAreas(data);
        console.log(data)
      } catch (err) {
        setError("Failed to load areas");
      } finally {
        setLoading(false);
      }
    }
    fetchAreas();
    
  }, []);

  // Build containers to display
  let displayedContainers: Container[] = [];

  const selectedArea = areas.find((a) => a.id === selectedAreaId);

  if (selectedArea) {
    if (selectedProjectId) {
      // If user selected a project
      const project = selectedArea.projects.find(
        (p) => p.id === selectedProjectId,
      );
      displayedContainers = project ? project.containers : [];
    } else {
      // No project selected => area-level containers
      displayedContainers = selectedArea.containers;
    }
  }

  /**
   * Called by <TaskBoard> to update the currently viewed containers
   * (area-level or project-level).
   */
  function handleSetContainers(newContainers: Container[]) {
    setAreas((oldAreas) =>
      oldAreas.map((area) => {
        if (area.id !== selectedAreaId) return area;

        if (selectedProjectId) {
          // Update containers in the selected project
          return {
            ...area,
            projects: area.projects.map((proj) =>
              proj.id === selectedProjectId
                ? { ...proj, containers: newContainers }
                : proj,
            ),
          };
        } else {
          // Update area-level containers
          return {
            ...area,
            containers: newContainers,
          };
        }
      }),
    );
  }

  // Handlers passed to the sidebar
  function handleSelectMain() {
    // "Main" => no area, no project
    setSelectedAreaId("");
    setSelectedProjectId(null);
  }

  function handleSelectArea(areaId: string) {
    setSelectedAreaId(areaId);
    setSelectedProjectId(null); // Reset project if area changed
  }

  function handleSelectProject(areaId: string, projectId: string) {
    // Optionally ensure we pick the correct area
    setSelectedAreaId(areaId);
    setSelectedProjectId(projectId);
  }

  return (
    <div className="w-screen">
      <Navbar></Navbar>
      {/* Sidebar */}
      <div className="flex w-full">
        <Sidebar
          areas={areas}
          onSelectMain={handleSelectMain}
          onSelectArea={handleSelectArea}
          onSelectProject={handleSelectProject}
          selectedAreaId={selectedAreaId}
          selectedProjectId={selectedProjectId}
        >
          {/* No direct children needed here if you handle everything in the sidebar */}
        </Sidebar>

        <div className="flex-1 p-4">
          {/* Toggle View Button */}
          <div className="mb-4 flex items-center justify-end">
            <button
              onClick={toggleView}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {isKanbanView ? "Switch to List View" : "Switch to Board View"}
            </button>
          </div>

          {/* Render Board */}
          <TaskBoard
            containers={displayedContainers}
            setContainers={handleSetContainers}
            isKanbanView={isKanbanView}
          />
        </div>
      </div>
    </div>
  );
}
