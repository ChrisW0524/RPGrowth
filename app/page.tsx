import CustomSwitch from "@/components/CustomSwitch";
import HabitTracker from "@/components/HabitTable";
import Navbar from "@/components/Navbar";

const habits = [
  { name: "Drink Water", group: "Health" },
  { name: "Exercise", group: "Health" },
  { name: "Read 20 Pages", group: "Education" },
  { name: "Learn a New Word", group: "Education" },
  { name: "Meditate", group: "Awareness" },
  { name: "Practice Mindfulness", group: "Awareness" },
  { name: "Call a Friend", group: "Relationships" },
  { name: "Send a Thank-You Note", group: "Relationships" },
  { name: "Write in Journal", group: "Tenacity" },
  { name: "Finish a Tough Task", group: "Tenacity" },
];
export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <HabitTracker habits={habits} />
    </div>
  );
}
