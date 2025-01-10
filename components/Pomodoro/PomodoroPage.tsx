"use client";

import CircularProgressbar from "@/components/Pomodoro/CircularProgressbar";
import SettingsDialog from "@/components/Pomodoro/SettingsDialog";
import TimerButton from "@/components/Pomodoro/TimerButton";
import Button from "@/components/Pomodoro/ui/Button";
import { TimerType, useTimerContext } from "@/context/TimerContext";
import Navbar from "../Navbar";

function PomodoroPage() {
  const timerTabs = [
    { name: "pomodoro", value: "pomodoro" },
    { name: "short break", value: "shortBreak" },
    { name: "long break", value: "longBreak" },
  ];

  const timer = useTimerContext();

  const {
    pause,
    setPause,
    timerType,
    setTimerType,
    timeString,
    finish,
    restartTimer,
  } = timer;

  return (
    <div className="">
      <Navbar></Navbar>
      <div className="text-grayishBlue flex h-full w-full flex-col items-center justify-center text-6xl">
        <h1 className="text-2xl font-bold md:mt-12 md:text-4xl">pomodoro</h1>

        <nav className="z-10 mt-14">
          <ul className="gap- bg-darkBlue flex items-center justify-center rounded-full p-2 text-xs font-bold md:text-sm">
            {timerTabs.map((tab) => (
              <li key={tab.value} className="">
                <TimerButton
                  timerType={timerType}
                  setTimerType={setTimerType}
                  name={tab.name}
                  value={tab.value as TimerType}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="bg-clock-gradient shadow-clock-shadow mt-11 h-72 w-72 shrink-0 rounded-full p-4 md:h-[410px] md:w-[410px] md:p-5">
          <div className="bg-darkBlue isolate flex h-full w-full flex-col items-center justify-center rounded-full">
            <CircularProgressbar />
            <div className="w-full text-center text-5xl font-bold md:text-7xl">
              {timeString}
            </div>

            <Button
              className="hover:text-accent mt-5 rounded-full pl-3 text-sm font-bold uppercase tracking-[0.8rem] md:tracking-[0.9rem]"
              onClick={() => {
                if (finish) {
                  restartTimer();
                } else {
                  setPause(!pause);
                }
              }}
            >
              {pause ? (finish ? "restart" : "start") : "pause"}
            </Button>
          </div>
        </div>

        <div className="mt-14">
          <SettingsDialog />
        </div>
      </div>
    </div>
  );
}

export default PomodoroPage;
