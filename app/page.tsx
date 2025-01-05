import CustomSwitch from "@/components/CustomSwitch";
import HabitTracker from "@/components/HabitTable";

const habits = [
  { name: 'Drink Water',       group: 'Health' },
  { name: 'Exercise',          group: 'Health' },
  { name: 'Read 20 Pages',     group: 'Education' },
  { name: 'Learn a New Word',  group: 'Education' },
  { name: 'Meditate',          group: 'Awareness' },
  { name: 'Practice Mindfulness', group: 'Awareness' },
  { name: 'Call a Friend',     group: 'Relationships' },
  { name: 'Send a Thank-You Note', group: 'Relationships' },
  { name: 'Write in Journal',  group: 'Tenacity' },
  { name: 'Finish a Tough Task', group: 'Tenacity' },
];
export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl">
        <span className="text-wdbBlue">Web Development</span> at Berkeley
      </h1>
      <p>
        Full-stack web development project template. Check the README for more
        information!
      </p>
      <CustomSwitch />
      <HabitTracker habits={habits}/>
    </div>
  );
}
