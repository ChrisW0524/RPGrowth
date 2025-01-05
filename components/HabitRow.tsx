"use client";

import React from 'react';
import dayjs, { Dayjs } from 'dayjs';

/**
 * Props for a single row of date cells (no left "habit name" column).
 */
interface HabitRowProps {
  /** The habit's unique name (not rendered here, you show it on the left panel). */
  habitName: string;
  displayedDates: Dayjs[];
  computeStreak: (habitName: string, date: Dayjs) => number;
  completedStatus: { [habitName: string]: { [date: string]: boolean } };
  toggleCompletion: (habitName: string, date: Dayjs) => void;
}

/**
 * Simple color scale to indicate streak length (1–7 days).
 */
const colorScale = [
  'bg-red-100', // 1-day streak
  'bg-red-200', // 2-day streak
  'bg-red-300',
  'bg-red-400',
  'bg-red-500',
  'bg-red-600',
  'bg-red-700', // 7+ days
];

/**
 * Returns the appropriate background color class for a given streak length.
 * 0 => 'bg-white'
 * 1 => 'bg-red-100'
 * ...
 * >=7 => 'bg-red-700'
 */
function getStreakColor(streak: number): string {
  if (streak === 0) return 'bg-white';
  const index = Math.min(streak, colorScale.length) - 1;
  return colorScale[index];
}

const CELL_WIDTH = "w-12";
const CELL_HEIGHT = "h-12";

const HabitRow: React.FC<HabitRowProps> = ({
  habitName,
  displayedDates,
  computeStreak,
  completedStatus,
  toggleCompletion,
}) => {
  return (
    <tr>
      {displayedDates.map((date) => {
        const dateKey = date.format('YYYY-MM-DD');
        const isCompleted = completedStatus[habitName]?.[dateKey] || false;
        const streakLength = isCompleted ? computeStreak(habitName, date) : 0;

        // If completed, use the streak color.
        // If uncompleted and is today => 'bg-yellow-100'
        // Otherwise => 'bg-white'
        const isToday = date.isSame(dayjs().startOf('day'), 'day');
        let cellColor = isCompleted
          ? getStreakColor(streakLength)
          : isToday
            ? 'bg-yellow-100'
            : 'bg-white';

        return (
          <td
            key={dateKey}
            /**
             * 1) Use onMouseDown instead of onClick.
             * 2) e.preventDefault() stops focus / text-cursor.
             * 3) contentEditable={false} + select-none => no text selection or cursor.
             */
            onMouseDown={(e) => {
              e.preventDefault();
              toggleCompletion(habitName, date);
            }}
            contentEditable={false}
            className={[
              'cursor-pointer',
              'select-none',   // Disables text selection
              CELL_WIDTH,
              CELL_HEIGHT,
              'transition-colors',
              cellColor,
              // Hover effect
              isCompleted
                ? 'hover:opacity-90'
                : (isToday ? 'hover:bg-yellow-200' : 'hover:bg-gray-100'),
            ].join(' ')}
          />
        );
      })}
    </tr>
  );
};

export default HabitRow;
