import React, { createContext, useContext, useEffect, useState } from "react";
import { useSettingsContext } from "./SettingsContext";

export type TimerType = "pomodoro" | "shortBreak" | "longBreak";

type TimerContextType = {
  restart: boolean;
  time: number;
  pause: boolean;
  timeString: string;
  timerType: TimerType;
  offset: number;
  finish: boolean;
  setPause: (pause: boolean) => void;
  restartTimer: () => void;
  setTimerType: (timerType: TimerType) => void;
};

const TimerContext = createContext({} as TimerContextType);

const secondsMultiplier = 60;

const createTimerWorker = () => {
  const workerCode = `
    self.onmessage = function (e) {
  const intervalId = setInterval(() => {
    console.log("timerworker")

    if (e.data.pause || e.data.time <= 0) {
      clearInterval(intervalId);
      postMessage(0);
    } else {
      e.data.time -= 1;
      postMessage(e.data.time);
      // postMessage("tick");
    }
  }, 1000);
};
  `;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
};

const createOffsetWorker = () => {
  const workerCode = `
    self.onmessage = function (e) {
  const intervalId = setInterval(() => {
    postMessage("tick");
    console.log("offsetworker")
    if (e.data.pause || e.data.offset <= 0) {
      clearInterval(intervalId);
    } else {
      e.data.offset -= e.data.offsetPerSecond / 10;
    }
  }, 100);
};

  `;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob));
};

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useSettingsContext();

  const { pomodoro, shortBreak, longBreak } = settings;

  const [restart, setRestart] = useState(false);

  const [finish, setFinish] = useState(false);

  const [pause, setPause] = useState(true);

  const [time, setTime] = useState(0);

  const [timerType, setTimerType] = useState<TimerType>("pomodoro");

  const [timeString, setTimeString] = useState("");

  const [offset, setOffset] = useState(968);

  const restartTimer = () => {
    setRestart(true);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (restart) {
      timeoutId = setTimeout(() => {
        setOffset(968);
        setPause(false);
        setFinish(false);
      }, 100);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [restart]);

  const getTimeString = (time: number) => {
    const minutes = Math.floor(time / secondsMultiplier);
    const seconds = time % secondsMultiplier;
    return `${minutes.toFixed(0).padStart(2, "0")}:${seconds
      .toFixed(0)
      .padStart(2, "0")}`;
  };

  const getActiveTimerTypeTime = () => {
    if (timerType === "pomodoro") {
      return pomodoro;
    } else if (timerType === "shortBreak") {
      return shortBreak;
    } else if (timerType === "longBreak") {
      return longBreak;
    }
    return 0;
  };

  const setTimeBasedOnTimerType = () => {
    if (timerType === "pomodoro") {
      setTime(pomodoro * secondsMultiplier);
    } else if (timerType === "shortBreak") {
      setTime(shortBreak * secondsMultiplier);
    } else if (timerType === "longBreak") {
      setTime(longBreak * secondsMultiplier);
    }
  };

  const activeTimerTypeTime = getActiveTimerTypeTime();

  const timeInSeconds = activeTimerTypeTime * secondsMultiplier;

  const offsetPerSecond = 968 / timeInSeconds;

  // use worker to update time
  useEffect(() => {
    let worker: Worker;
    if (!pause) {
      worker = createTimerWorker()
      console.log(worker);
      worker.postMessage({ pause, time });
      worker.onmessage = (e) => {
        if (e.data > 0) {
          setTime((prevTime) => {
            if (prevTime <= 0) {
              return 0;
            }
            return prevTime - 1;
          });
        } else {
          if (restart) setRestart(false);
          setTime(0);
          setPause(true);
          setFinish(true);
        }
      };
    }
    return () => {
      if (worker) {
        worker.terminate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause, timerType, settings]);

  // use worker to update offset
  useEffect(() => {
    let worker: Worker;
    if (!pause) {
      worker = createOffsetWorker()
      console.log(worker);
      worker.postMessage({ pause, offset, offsetPerSecond });
      worker.onmessage = (e) => {
        if (e.data === "tick") {
          setOffset((prevOffset) => {
            if (prevOffset <= 0) {
              return 0;
            }
            return prevOffset - offsetPerSecond / 10;
          });
        }
      };
    }
    return () => {
      if (worker) {
        worker.terminate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause, timerType, offsetPerSecond]);

  useEffect(() => {
    setTimeBasedOnTimerType();
    setPause(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerType, pomodoro, shortBreak, longBreak]);

  useEffect(() => {
    setTimeBasedOnTimerType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart]);

  useEffect(() => {
    setOffset(968);
  }, [timerType, activeTimerTypeTime]);

  useEffect(() => {
    setFinish(false);
  }, [timerType]);

  useEffect(() => {
    setTimeString(getTimeString(time));
  }, [time]);

  useEffect(() => {
    setPause(true);
  }, [pomodoro, shortBreak, longBreak]);

  return (
    <TimerContext.Provider
      value={{
        restart,
        time,
        pause,
        setPause,
        restartTimer,
        timeString,
        timerType,
        setTimerType,
        offset,
        finish,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => useContext(TimerContext);
