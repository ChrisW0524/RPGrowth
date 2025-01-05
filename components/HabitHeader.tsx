"use client";

import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";

interface HabitHeaderProp {
  habit: { name: string };
  cellHeight: string;

  recurrence?: boolean[];
  onRecurrenceChange?: (days: boolean[]) => void;
}

const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const HabitHeader: React.FC<HabitHeaderProp> = ({
  habit,
  cellHeight,
  recurrence = [true,true,true,true,true,true,true],
  onRecurrenceChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitName, setHabitName] = useState(habit.name);

  // local copy of the recurrence array
  const [localRecurrence, setLocalRecurrence] = useState<boolean[]>(recurrence);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Toggle a single day
  const toggleDay = (index: number) => {
    const updated = [...localRecurrence];
    updated[index] = !updated[index];
    setLocalRecurrence(updated);
  };

  // Save changes => parent
  const saveChanges = () => {
    onRecurrenceChange?.(localRecurrence);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={[
          "group relative flex items-center justify-between",
          cellHeight,
        ].join(" ")}
        style={{
          minWidth: "48px",
          maxWidth: "200px",
          minHeight: "48px",
          maxHeight: "48px",
          padding: "0 8px",
        }}
      >
        {habitName}

        <IoMdSettings
          className="ml-2 cursor-pointer text-gray-500 opacity-0 transition-opacity duration-150 hover:text-blue-500 group-hover:opacity-100"
          onClick={toggleModal}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-medium">Edit Habit</h2>

            {/* Habit name */}
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="mb-4 w-full rounded border p-2"
              placeholder="Habit name"
            />

            {/* 7 checkboxes for recurrence */}
            <div className="grid grid-cols-7 gap-2 mb-4 text-center">
              {daysOfWeek.map((day, idx) => (
                <label key={day} className="cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={localRecurrence[idx]}
                    onChange={() => toggleDay(idx)}
                  />
                  {day}
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={toggleModal}
                className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-500 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitHeader;
