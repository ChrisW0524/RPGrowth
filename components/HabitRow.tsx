"use client";

import React from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface HabitRowProps {
  habitName: string;
  displayedDates: Dayjs[];
  completedStatus: { [habitName: string]: { [date: string]: boolean } };
  toggleCompletion: (habitName: string, date: Dayjs) => void;

  /**
   * 7 booleans: e.g. [true, false, true, ...]
   * If false => day is "inactive", 
   * but user can still click to complete. 
   * If not completed & inactive => visually gray. 
   * If completed & inactive => show streak color, count for streak.
   */
  recurrence?: boolean[];
}

/**
 * Let's use a red color scale for 1–7 day streaks
 */
const colorScale = [
  'bg-red-100',
  'bg-red-200',
  'bg-red-300',
  'bg-red-400',
  'bg-red-500',
  'bg-red-600',
  'bg-red-700',
];

/** Return color for a streak length (1..7). */
function getStreakColor(streak: number): string {
  if (streak === 0) return 'bg-white';
  const index = Math.min(streak, colorScale.length) - 1;
  return colorScale[index];
}

const CELL_WIDTH = "w-12";
const CELL_HEIGHT = "h-12";

/**
 * A row of date cells for one habit. 
 * Inactive day + not completed => bg-gray-500
 * Inactive day + completed => streak color
 * Active day + not completed => white (or yellow if today)
 * Active day + completed => streak color
 * 
 * We implement custom streak logic that doesn't break if 
 * an inactive day is not completed. But it does count an inactive 
 * day if it is completed.
 */
const HabitRow: React.FC<HabitRowProps> = ({
  habitName,
  displayedDates,
  completedStatus,
  toggleCompletion,
  recurrence = [true, true, true, true, true, true, true],
}) => {
  
  /**
   * Move backward from `date`, building streak. 
   * If day is active & completed => +1 
   * If day is active & not completed => break 
   * If day is inactive & completed => +1 
   * If day is inactive & not completed => skip 
   */
  function computeCustomStreak(habitName: string, date: Dayjs): number {
    let streak = 0;
    let current = date.clone();

    while (true) {
      const dow = current.day();
      const isActive = recurrence[dow];
      const dateStr = current.format('YYYY-MM-DD');
      const isCompleted = completedStatus[habitName]?.[dateStr] || false;

      if (isActive && !isCompleted) {
        // break the streak
        break;
      } else if (!isActive && !isCompleted) {
        // skip, but do not break => just go to previous day
        current = current.subtract(1, 'day');
        continue;
      } else {
        // either active & completed, or inactive & completed => +1
        streak++;
        current = current.subtract(1, 'day');
      }

      // If we've gone too far in the past, optionally break
      if (current.year() < 2020) break; 
    }

    return streak;
  }

  return (
    <tr>
      {displayedDates.map((date) => {
        const dateKey = date.format('YYYY-MM-DD');
        const isCompleted = completedStatus[habitName]?.[dateKey] || false;
        // We'll use our custom logic to compute the chain ignoring inactive uncompleted
        const streakLength = isCompleted ? computeCustomStreak(habitName, date) : 0;

        // If day is active, show normal color if not completed
        // If day is inactive & not completed => gray 
        // If day is inactive & completed => streak color
        const dayOfWeek = date.day();
        const isActive = recurrence[dayOfWeek];

        let cellColor = 'bg-white';
        const isToday = date.isSame(dayjs().startOf('day'), 'day');

        if (isCompleted) {
          // completed => streak color
          cellColor = getStreakColor(streakLength);
        } else {
          // not completed
          if (!isActive) {
            cellColor = 'bg-gray-500'; 
          } else if (isToday) {
            cellColor = 'bg-yellow-100';
          } else {
            cellColor = 'bg-white';
          }
        }

        return (
          <td
            key={dateKey}
            onMouseDown={(e) => {
              e.preventDefault();
              // user can still toggle, even if inactive
              toggleCompletion(habitName, date);
            }}
            contentEditable={false}
            className={[
              'select-none',
              CELL_WIDTH,
              CELL_HEIGHT,
              'transition-colors',
              'cursor-pointer',
              cellColor,
              // Hover effect
              isCompleted
                ? 'hover:opacity-90'
                : (isActive
                    ? (isToday ? 'hover:bg-yellow-200' : 'hover:bg-gray-100')
                    : 'hover:opacity-80' // maybe a subtle darkening for inactive?
                  ),
            ].join(' ')}
          />
        );
      })}
    </tr>
  );
};

export default HabitRow;
