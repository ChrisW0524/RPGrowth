import { TimerType } from "@/context/TimerContext";
import Button from "./ui/Button";

function TimerButton({
  timerType,
  setTimerType,
  name,
  value,
}: {
  timerType: TimerType;
  setTimerType: (timerType: TimerType) => void;
  name: string;
  value: TimerType;
}) {
  return (
    <Button
      className={`rounded-full px-4 py-3 ${
        timerType === value
          ? "bg-accent font-bold text-darkBlue"
          : "text-grayishBlue/40"
      }`}
      onClick={() => {
        setTimerType(value);
      }}
    >
      {name}
    </Button>
  );
}

export default TimerButton;
