"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import HabitRow from "./HabitRow";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdSettings,
} from "react-icons/io";
import HabitHeader from "./HabitHeader";

/** A single habit with a name and a group. */
interface Habit {
  name: string;
  group: string;
}

interface HabitTableProps {
  habits: Habit[];
}

/**
 * We'll keep COLUMN_WIDTH = 48 for exact 48px columns.
 */
const COLUMN_WIDTH = 48;

/**
 * We define classes or inline styles to enforce exactly 48x48 cells.
 */
const CELL_WIDTH = "w-12"; // ~48px
const CELL_HEIGHT = "h-12"; // ~48px

const HabitTable: React.FC<HabitTableProps> = ({ habits }) => {
  const [completedStatus, setCompletedStatus] = useState<{
    [habitName: string]: { [dateStr: string]: boolean };
  }>({});

  // The leftmost date in the table
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));

  // Number of columns to show
  const [daysToShow, setDaysToShow] = useState(7);

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Measure container width and figure out how many columns
   * we can fit at 48px each.
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

  /** Array of Dayjs objects for each column */
  const displayedDates = Array.from({ length: daysToShow }, (_, i) =>
    startDate.add(i, "day"),
  );

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

  function handlePrevious() {
    setStartDate((prev) => prev.subtract(daysToShow, "day"));
  }
  function handleNext() {
    setStartDate((prev) => prev.add(daysToShow, "day"));
  }

  function computeStreak(habitName: string, date: Dayjs): number {
    let streak = 0;
    let current = date.clone();
    while (completedStatus[habitName]?.[current.format("YYYY-MM-DD")]) {
      streak += 1;
      current = current.subtract(1, "day");
    }
    return streak;
  }

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
          {/* Top Left Corner (optional) */}
          <div
            className={`flex flex-row-reverse items-center bg-white pr-2 ${CELL_HEIGHT}`}
          >
            <IoIosArrowForward
              className="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-blue-500"
              onClick={handleNext}
            ></IoIosArrowForward>
            <IoIosArrowBack
              className="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-blue-500"
              onClick={handlePrevious}
            ></IoIosArrowBack>
          </div>

          {groupedHabits.map(({ group, habits: groupHabits }) => (
            <div key={group}>
              {/* Group heading on the left panel */}
              <div
                className={[
                  "flex items-center font-bold uppercase",
                  CELL_HEIGHT,
                ].join(" ")}
                style={{
                  minWidth: "48px",
                  maxWidth: "400px", // can be bigger for group text
                  minHeight: "48px",
                  maxHeight: "48px",
                  padding: "0 8px", // example: 8px horizontal
                }}
              >
                {group}
              </div>
              {/* Habit names */}
              {groupHabits.map((habit) => (
                <HabitHeader
                  key={habit.name}
                  habit={habit}
                  cellHeight={CELL_HEIGHT}
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
              borderSpacing: 0, // remove any default spacing
              tableLayout: "fixed", // ensures columns don't auto-resize
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
                    // Fix weird half-pixel bug
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
                  {/* Disabled group row on the RIGHT */}
                  <tr className="pointer-events-none">
                    <td
                      colSpan={displayedDates.length}
                      className={`box-border bg-gray-200 text-left uppercase ${CELL_HEIGHT}`}
                    >
                      {/* {group} */}
                    </td>
                  </tr>

                  {groupHabits.map((habit) => (
                    <HabitRow
                      key={habit.name}
                      habitName={habit.name}
                      displayedDates={displayedDates}
                      computeStreak={computeStreak}
                      completedStatus={completedStatus}
                      toggleCompletion={toggleCompletion}
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
