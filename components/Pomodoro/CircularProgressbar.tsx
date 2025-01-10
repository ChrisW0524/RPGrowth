import { useTimerContext } from "@/context/TimerContext";

function CircularProgressbar() {
  const TimerContext = useTimerContext();

  const { offset } = TimerContext;

  return (
    <svg
      width="340"
      height="340"
      viewBox="0 0 340 340"
      className="absolute -z-10 -rotate-90 scale-[72%] text-accent md:scale-[107%]"
    >
      <circle
        r="154"
        cx="170"
        cy="170"
        fill="transparent"
        stroke="transparent"
        strokeWidth="12px"
      ></circle>
      <circle
        r="154"
        cx="170"
        cy="170"
        fill="transparent"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="13px"
        strokeDasharray={968}
        strokeDashoffset={offset}
      ></circle>
    </svg>
  );
}

export default CircularProgressbar;
