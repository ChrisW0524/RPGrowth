"use client";

import { SettingsProvider } from "@/context/SettingsContext";
import { TimerProvider } from "@/context/TimerContext";
import PomodoroPage from "@/components/Pomodoro/PomodoroPage";

export default function MyApp({ Component, pageProps }: any) {
  return (
    <SettingsProvider>
      <TimerProvider>
        <PomodoroPage/>
      </TimerProvider>
    </SettingsProvider>
  );
}
