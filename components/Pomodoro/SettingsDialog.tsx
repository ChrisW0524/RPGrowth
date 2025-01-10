import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import FontSection from "./FontSection";
import ThemeSection from "./ThemeSection";
import TimeSection from "./TimeSection";
import { IoMdSettings } from "react-icons/io";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { useEffect, useState } from "react";
import { useSettingsContext, Font, Theme } from "@/context/SettingsContext";
import Button from "./ui/Button";

export type FormValues = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  font: Font;
  theme: Theme;
};

function SettingsDialog() {
  const [open, setOpen] = useState(false);

  const settings = useSettingsContext();

  const form = useForm<FormValues>({
    defaultValues: {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      font: "kumbh",
      theme: "default",
    },
  });

  const { handleSubmit, reset } = form;

  const submitSettings: SubmitHandler<FormValues> = (data) => {
    settings?.saveFont(data.font as Font);
    settings?.saveTheme(data.theme as Theme);
    settings?.savePomodoro(data.pomodoro);
    settings?.saveShortBreak(data.shortBreak);
    settings?.saveLongBreak(data.longBreak);

    setOpen(false);
  };

  useEffect(() => {
    const font = settings?.font;
    const theme = settings?.theme;
    const pomodoro = settings?.pomodoro;
    const shortBreak = settings?.shortBreak;
    const longBreak = settings?.longBreak;

    if (font || theme || pomodoro || shortBreak || longBreak) {
      reset({
        font: font ?? "kumbh",
        theme: (theme as Theme) ?? "default",
        pomodoro: pomodoro ?? 25,
        shortBreak: shortBreak ?? 5,
        longBreak: longBreak ?? 15,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
      <IoMdSettings />

      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="px-8 pb-12 pt-6"
            onSubmit={handleSubmit(submitSettings)}
          >
            <TimeSection />
            <hr className="border-darkBlue/10 my-6" />
            <FontSection />
            <hr className="border-darkBlue/10 my-6" />
            <ThemeSection />
            <div className="absolute -bottom-6 left-1/2 h-14 w-32 -translate-x-1/2 rounded-full bg-white">
              <Button
                className="bg-accent1 ring-accent1 hover:bg-accent1/80 focus-visible:outline-accent1 h-14 w-32 rounded-full font-bold text-white ring-1"
                type="submit"
              >
                Apply
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
