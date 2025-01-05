"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import HabitRow from "./HabitRow";
import HabitHeader from "./HabitHeader";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

/** A single habit with a name and a group. */
interface Habit {
  name: string;
  group: string;
}

interface HabitTableProps {
  habits: Habit[];
}

/**
 * We'll keep COLUMN_WIDTH = 48 for ~48px columns.
 */
const COLUMN_WIDTH = 48;

/** 
 * Classes for ~48px cells in Tailwind.
 */
const CELL_WIDTH = "w-12";
const CELL_HEIGHT = "h-12";

const HabitTable: React.FC<HabitTableProps> = ({ habits }) => {
  /**
   * completedStatus[habitName][YYYY-MM-DD] => boolean
   * e.g. completedStatus["Drink Water"]["2024-01-01"] = true
   */
  const [completedStatus, setCompletedStatus] = useState<{
    [habitName: string]: { [dateStr: string]: boolean };
  }>({});

  /**
   * recurrenceSettings[habitName] => boolean[] for [Sun..Sat].
   * e.g. recurrence["Drink Water"] = [true,true,true,true,true,true,true]
   */
  const [recurrenceSettings, setRecurrenceSettings] = useState<{
    [habitName: string]: boolean[];
  }>({});

  /** The leftmost date in the table. */
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));

  /** How many columns to show (responsive). */
  const [daysToShow, setDaysToShow] = useState(7);

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Ensure each new habit has default recurrence (all days = true).
   */
  useEffect(() => {
    habits.forEach((h) => {
      if (!recurrenceSettings[h.name]) {
        setRecurrenceSettings((prev) => ({
          ...prev,
          [h.name]: [true, true, true, true, true, true, true], // default
        }));
      }
    });
  }, [habits, recurrenceSettings]);

  /**
   * Determine how many columns fit at ~48px each.
   */
  const updateDaysToShow = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const newDays = Math.max(1, Math.floor(containerWidth / COLUMN_WIDTH));
      setDaysToShow(newDays);
    }
  }, []);

  useEffect(() => {
    updateDaysToShow();
    window.addEventListener("resize", updateDaysToShow);
    return () => {
      window.removeEventListener("resize", updateDaysToShow);
    };
  }, [updateDaysToShow]);

  /**
   * Array of Dayjs objects for each displayed column.
   */
  const displayedDates = Array.from({ length: daysToShow }, (_, i) =>
    startDate.add(i, "day"),
  );

  /**
   * Toggle completion for a habit on a specific date.
   */
  function toggleCompletion(habitName: string, date: Dayjs) {
    setCompletedStatus((prev) => {
      const dateStr = date.format("YYYY-MM-DD");
      const habitMap = prev[habitName] || {};
      const wasCompleted = habitMap[dateStr] || false;
      return {
        ...prev,
        [habitName]: {
          ...habitMap,
          [dateStr]: !wasCompleted,
        },
      };
    });
  }

  /**
   * Move left or right by daysToShow days.
   */
  function handlePrevious() {
    setStartDate((prev) => prev.subtract(daysToShow, "day"));
  }
  function handleNext() {
    setStartDate((prev) => prev.add(daysToShow, "day"));
  }

  /**
   * Group the habits by group so we can render them in sections.
   */
  const allGroups = Array.from(new Set(habits.map((h) => h.group)));
  const groupedHabits = allGroups.map((groupName) => ({
    group: groupName,
    habits: habits.filter((h) => h.group === groupName),
  }));

  return (
    <div ref={containerRef} className="mx-auto max-w-6xl p-4">
      {/* Pagination controls */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
        >
          &larr; Previous
        </button>
        <div className="text-center font-bold">
          {displayedDates[0]?.format("MMM D, YYYY").toLowerCase()} &mdash;{" "}
          {displayedDates[displayedDates.length - 1]
            ?.format("MMM D, YYYY")
            .toLowerCase()}
        </div>
        <button
          onClick={handleNext}
          className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
        >
          Next &rarr;
        </button>
      </div>

      <div className="flex">
        {/* LEFT PANEL */}
        <div className="flex-shrink-0">
          {/* Top Left Corner: optional arrows */}
          <div className={`flex flex-row-reverse items-center bg-white pr-2 ${CELL_HEIGHT}`}>
            <IoIosArrowForward
              className="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-blue-500"
              onClick={handleNext}
            />
            <IoIosArrowBack
              className="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-blue-500"
              onClick={handlePrevious}
            />
          </div>

          {/* Render group headings + habit headers */}
          {groupedHabits.map(({ group, habits: groupHabits }) => (
            <div key={group}>
              <div
                className={[
                  "flex items-center font-bold uppercase",
                  CELL_HEIGHT,
                ].join(" ")}
                style={{
                  minWidth: "48px",
                  maxWidth: "400px",
                  minHeight: "48px",
                  maxHeight: "48px",
                  padding: "0 8px",
                }}
              >
                {group}
              </div>
              {groupHabits.map((habit) => (
                <HabitHeader
                  key={habit.name}
                  habit={habit}
                  cellHeight={CELL_HEIGHT}
                  // Pass array if we have it
                  recurrence={
                    recurrenceSettings[habit.name] ?? [true,true,true,true,true,true,true]
                  }
                  // If user changes day-of-week checkboxes, store in state
                  onRecurrenceChange={(days) => {
                    setRecurrenceSettings((prev) => ({
                      ...prev,
                      [habit.name]: days,
                    }));
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 overflow-x-auto">
          <table
            className="w-full table-fixed border-collapse border"
            style={{
              borderSpacing: 0,
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                {displayedDates.map((date) => (
                  <th
                    key={date.toString()}
                    className={[
                      "bg-white",
                      CELL_WIDTH,
                      CELL_HEIGHT,
                      "box-border border-b border-gray-300 text-center text-xs",
                    ].join(" ")}
                    style={{
                      minWidth: "48px",
                      maxWidth: "48px",
                      minHeight: "48px",
                      maxHeight: "48px",
                      padding: 0,
                    }}
                  >
                    {date.format("MMM D").toLowerCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupedHabits.map(({ group, habits: groupHabits }) => (
                <React.Fragment key={group}>
                  {/* Group heading row on the right side */}
                  <tr className="pointer-events-none">
                    <td
                      colSpan={displayedDates.length}
                      className={`box-border bg-gray-200 text-left uppercase ${CELL_HEIGHT}`}
                    >
                      {/* Could repeat group name if desired */}
                    </td>
                  </tr>

                  {groupHabits.map((habit) => (
                    <HabitRow
                      key={habit.name}
                      habitName={habit.name}
                      displayedDates={displayedDates}
                      completedStatus={completedStatus}
                      toggleCompletion={toggleCompletion}
                      // Pass the same recurrence array
                      recurrence={
                        recurrenceSettings[habit.name] ?? [true,true,true,true,true,true,true]
                      }
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HabitTable;
