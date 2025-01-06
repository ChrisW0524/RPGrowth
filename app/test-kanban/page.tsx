import KanbanBoard from "@/components/Kanban/KanbanBoard";
import Sidebar, { SidebarItem } from "@/components/Sidebar";
import { Settings, Bell, User } from "lucide-react"; // Import necessary icons


export default function Home() {
  return (
    <div className="flex w-screen">
      <Sidebar>
        {/* Sidebar Items */}
        <SidebarItem icon={<Bell size={20} />} text="Notifications" alert />
        <SidebarItem icon={<User size={20} />} text="Profile"/>
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
      </Sidebar>
      <KanbanBoard></KanbanBoard>
    </div>
  );
}
