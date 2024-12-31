"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';

/**
 * Possible habit groups. 
 */
type HabitGroup = 'Health' | 'Education' | 'Awareness' | 'Relationships' | 'Tenacity';

/**
 * A single habit with a name and a group.
 */
interface Habit {
  name: string;
  group: HabitGroup;
}

/**
 * Props:
 * - habits: an array of Habit objects
 */
interface HabitTrackerProps {
  habits: Habit[];
}

/**
 * For each group, we define an array of Tailwind background-color classes
 * from lightest to darkest for building up a streak.
 */
const groupColorScales: Record<HabitGroup, string[]> = {
  Health: [
    'bg-red-100',
    'bg-red-200',
    'bg-red-300',
    'bg-red-400',
    'bg-red-500',
    'bg-red-600',
    'bg-red-700',
  ],
  Education: [
    'bg-purple-100',
    'bg-purple-200',
    'bg-purple-300',
    'bg-purple-400',
    'bg-purple-500',
    'bg-purple-600',
    'bg-purple-700',
  ],
  Awareness: [
    'bg-green-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
  ],
  Relationships: [
    'bg-blue-100',
    'bg-blue-200',
    'bg-blue-300',
    'bg-blue-400',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700',
  ],
  Tenacity: [
    'bg-orange-100',
    'bg-orange-200',
    'bg-orange-300',
    'bg-orange-400',
    'bg-orange-500',
    'bg-orange-600',
    'bg-orange-700',
  ],
};

/**
 * Return the appropriate CSS class for a given streak length, based on which group the habit belongs to.
 * - If streak=0 => 'bg-white' (no completion)
 * - If streak=1 => groupColorScales[group][0] (e.g. 'bg-red-100')
 * - If streak=2 => groupColorScales[group][1] (e.g. 'bg-red-200')
 * - ...
 * - If streak>=7 => groupColorScales[group][6] (e.g. 'bg-red-700')
 */
function getStreakColor(group: HabitGroup, streak: number): string {
  if (streak === 0) {
    return 'bg-white';
  }
  const colors = groupColorScales[group];
  const index = Math.min(streak, colors.length) - 1;
  return colors[index];
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits }) => {
  /**
   * completedStatus: for each habit name, a map of date-string => boolean
   * e.g. { "Drink Water": { "2024-01-01": true, "2024-01-02": false }, ... }
   */
  const [completedStatus, setCompletedStatus] = useState<{
    [habitName: string]: { [date: string]: boolean };
  }>({});

  /**
   * startDate is the leftmost date currently shown in the table.
   */
  const [startDate, setStartDate] = useState(dayjs().startOf('day'));

  /**
   * daysToShow is how many columns fit on screen, computed by measuring container width.
   */
  const [daysToShow, setDaysToShow] = useState(7);

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Measure container width and estimate how many columns can fit (w-16 ~ 64px).
   */
  const updateDaysToShow = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const columnWidth = 64; // matches w-16 in Tailwind
      const newDaysToShow = Math.max(1, Math.floor(containerWidth / columnWidth));
      setDaysToShow(newDaysToShow);
    }
  }, []);

  // Attach a resize listener to recompute daysToShow.
  useEffect(() => {
    updateDaysToShow();
    window.addEventListener('resize', updateDaysToShow);
    return () => {
      window.removeEventListener('resize', updateDaysToShow);
    };
  }, [updateDaysToShow]);

  // Generate the consecutive dates displayed as columns.
  const displayedDates = Array.from({ length: daysToShow }, (_, i) =>
    startDate.add(i, 'day')
  );

  /**
   * Toggle completion for a given habit on a specific date.
   */
  function toggleCompletion(habitName: string, date: Dayjs) {
    setCompletedStatus((prev) => {
      const dateStr = date.format('YYYY-MM-DD');
      const habitStatus = prev[habitName] || {};
      const wasCompleted = habitStatus[dateStr] || false;
      return {
        ...prev,
        [habitName]: {
          ...habitStatus,
          [dateStr]: !wasCompleted,
        },
      };
    });
  }

  /**
   * Move left or right by daysToShow days.
   */
  function handlePrevious() {
    setStartDate((prev) => prev.subtract(daysToShow, 'day'));
  }
  function handleNext() {
    setStartDate((prev) => prev.add(daysToShow, 'day'));
  }

  /**
   * Compute how many consecutive days (streak) this habit has been completed up to and including `date`.
   */
  function computeStreak(habitName: string, date: Dayjs): number {
    let streak = 0;
    let current = date.clone();

    // Move backwards while each previous day is completed.
    while (completedStatus[habitName]?.[current.format('YYYY-MM-DD')]) {
      streak += 1;
      current = current.subtract(1, 'day');
    }
    return streak;
  }

  /**
   * We have 5 groups. Let's define an order so we always list them in the same sequence.
   */
  const allGroups: HabitGroup[] = [
    'Health',
    'Education',
    'Awareness',
    'Relationships',
    'Tenacity',
  ];

  /**
   * Group the habits by their group in a structure like:
   * [
   *   { group: 'Health', habits: [ {name: 'Drink Water', group:'Health'}, ... ] },
   *   { group: 'Education', habits: [...] },
   *   ...
   * ]
   */
  const groupedHabits = allGroups.map((group) => {
    const groupHabits = habits.filter((h) => h.group === group);
    return { group, habits: groupHabits };
  });

  return (
    <div ref={containerRef} className="p-4 max-w-4xl mx-auto">
      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevious}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          &larr; Previous
        </button>
        <div className="font-bold text-center">
          {displayedDates[0]?.format('MMM D, YYYY').toLowerCase()} &mdash;{' '}
          {displayedDates[displayedDates.length - 1]?.format('MMM D, YYYY').toLowerCase()}
        </div>
        <button
          onClick={handleNext}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next &rarr;
        </button>
      </div>

      {/* Table */}
      <table className="table-fixed w-full border-collapse">
        <thead>
          <tr>
            {/* Blank corner cell */}
            <th className="border bg-gray-100 w-32 p-2"></th>
            {/* One <th> per displayed date */}
            {displayedDates.map((date) => (
              <th
                key={date.toString()}
                className="border bg-gray-100 p-2 w-16 h-16 text-xs"
              >
                {date.format('MMM D').toLowerCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupedHabits.map(({ group, habits: groupHabits }) => {
            if (groupHabits.length === 0) {
              // If there are no habits in this group, you could skip or show the group header anyway.
              // Let's still show the group header to keep consistency.
              return (
                <React.Fragment key={group}>
                  {/* Group row (disabled) */}
                  <tr className="pointer-events-none bg-gray-200">
                    <th
                      colSpan={daysToShow + 1}
                      className="p-2 text-left uppercase"
                    >
                      {group}
                    </th>
                  </tr>
                  {/* No habits -> no rows */}
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={group}>
                {/* Group row (disabled) */}
                <tr className="pointer-events-none bg-gray-200">
                  <th
                    colSpan={daysToShow + 1}
                    className="p-2 text-left uppercase"
                  >
                    {group}
                  </th>
                </tr>

                {/* Rows for each habit in this group */}
                {groupHabits.map((habit) => (
                  <tr key={habit.name}>
                    {/* Habit name */}
                    <th className="border bg-gray-50 text-left p-2 w-32">
                      {habit.name}
                    </th>
                    {/* One <td> per displayed date */}
                    {displayedDates.map((date) => {
                      const dateKey = date.format('YYYY-MM-DD');
                      const isCompleted =
                        completedStatus[habit.name]?.[dateKey] || false;
                      const streakLength = isCompleted
                        ? computeStreak(habit.name, date)
                        : 0;

                      // Get color from the group-specific scale.
                      const bgColor = getStreakColor(habit.group, streakLength);

                      return (
                        <td
                          key={dateKey}
                          onClick={() => toggleCompletion(habit.name, date)}
                          className={[
                            'border',
                            'cursor-pointer',
                            'w-16',
                            'h-16',
                            'transition-colors',
                            bgColor,
                            // Hover effect
                            isCompleted ? 'hover:opacity-90' : 'hover:bg-gray-100',
                          ].join(' ')}
                        />
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HabitTracker;
