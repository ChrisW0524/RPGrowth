"use client"

import { useState } from "react";
import { Bell, Settings, User } from "lucide-react";
import KanbanBoard from "@/components/Kanban/KanbanBoard";
import ListBoard from "@/components/List/ListBoard";
import Sidebar, { SidebarItem } from "@/components/Sidebar";

import { TaskType, ContainerType } from "@/types";

export default function Home() {
  // State for toggling views
  const [isKanbanView, setIsKanbanView] = useState<boolean>(false);

  // Shared state for containers
  const [containers, setContainers] = useState<ContainerType[]>([]);

  // Toggle View Handler
  const toggleView = () => {
    setIsKanbanView(!isKanbanView)
  };

  return (
    <div className="flex w-screen">
      <Sidebar>
        {/* Sidebar Items */}
        <SidebarItem icon={<Bell size={20} />} text="Notifications" alert />
        <SidebarItem icon={<User size={20} />} text="Profile" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
      </Sidebar>
      <div className="flex-1 p-4">
        {/* Toggle View Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleView}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {isKanbanView ? "Switch to List View" : "Switch to Board View"}
          </button>
        </div>

        {/* Render View Based on State */}
        {isKanbanView ? (
          <KanbanBoard containers={containers} setContainers={setContainers} />
        ) : (
          <ListBoard containers={containers} setContainers={setContainers} />
        )}
      </div>
    </div>
  );
}
