import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "default" | "teal-theme" | "purple-theme";
export type Font = "kumbh" | "roboto" | "mono";

type SettingsContext = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  theme: string;
  saveTheme: (theme: Theme) => void;
  font: Font;
  saveFont: (font: Font) => void;
  savePomodoro: (pomodoro: number) => void;
  saveShortBreak: (shortBreak: number) => void;
  saveLongBreak: (longBreak: number) => void;
};

type SettingsProviderProps = {
  children: React.ReactNode;
};

export const SettingsContext = createContext({} as SettingsContext);

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const themeFromLocalStorage = localStorage.getItem("theme") as Theme;
  const fontFromLocalStorage = localStorage.getItem("font") as Font;
  const pomodoroFromLocalStorage = localStorage.getItem("pomodoro")
    ? parseInt(localStorage.getItem("pomodoro")!)
    : 25;
  const shortBreakFromLocalStorage = localStorage.getItem("shortBreak")
    ? parseInt(localStorage.getItem("shortBreak")!)
    : 5;
  const longBreakFromLocalStorage = localStorage.getItem("longBreak")
    ? parseInt(localStorage.getItem("longBreak")!)
    : 15;

  const [theme, setTheme] = useState<Theme>(themeFromLocalStorage || "default");
  const [font, setFont] = useState<Font>(fontFromLocalStorage || "kumbh");
  const [pomodoro, setPomodoro] = useState<number>(
    pomodoroFromLocalStorage || 25,
  );
  const [shortBreak, setShortBreak] = useState<number>(
    shortBreakFromLocalStorage || 5,
  );
  const [longBreak, setLongBreak] = useState<number>(
    longBreakFromLocalStorage || 15,
  );

  const saveTheme = (theme: Theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  const saveFont = (font: Font) => {
    setFont(font);
    localStorage.setItem("font", font);
  };

  const savePomodoro = (pomodoro: number) => {
    setPomodoro(pomodoro);
    localStorage.setItem("pomodoro", pomodoro.toString());
  };

  const saveShortBreak = (shortBreak: number) => {
    setShortBreak(shortBreak);
    localStorage.setItem("shortBreak", shortBreak.toString());
  };

  const saveLongBreak = (longBreak: number) => {
    setLongBreak(longBreak);
    localStorage.setItem("longBreak", longBreak.toString());
  };

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.body.dataset.font = font;
  }, [font]);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        saveTheme,
        font,
        saveFont,
        pomodoro,
        savePomodoro,
        shortBreak,
        saveShortBreak,
        longBreak,
        saveLongBreak,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettingsContext = () => {
  if (!SettingsContext) {
    throw new Error("useSettingsContext must be used within SettingsProvider");
  }

  return useContext(SettingsContext);
};
