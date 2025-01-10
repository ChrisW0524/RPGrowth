import TimeInput from "./ui/TimeInput";

function TimeSection() {
  return (
    <div className="flex flex-col items-center md:items-start ">
      <h2 className="text-sm font-bold tracking-[5px]">TIME (MINUTES)</h2>

      <div className="mt-4 flex w-full flex-col gap-4 md:flex-row">
        <TimeInput title="pomodoro" inputName="pomodoro" />
        <TimeInput title="short break" inputName="shortBreak" />
        <TimeInput title="long break" inputName="longBreak" />
      </div>
    </div>
  );
}

export default TimeSection;
