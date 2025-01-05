"use client";

import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";

// Define Props Type
interface HabitHeaderProp {
  habit: {
    name: string;
  };
  cellHeight: string;
}

const HabitHeader: React.FC<HabitHeaderProp> = ({ habit, cellHeight }) => {
  // State for modal visibility and input value
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitName, setHabitName] = useState(habit.name);

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHabitName(e.target.value);
  };

  // Save changes (you can implement further logic here, e.g., API call)
  const saveChanges = () => {
    console.log("Habit updated:", habitName);
    setIsModalOpen(false); // Close modal after saving
  };

  return (
    <>
      {/* Habit Header */}
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

        {/* Settings Icon */}
        <IoMdSettings
          className="hover:text-blue-500 ml-2 cursor-pointer text-gray-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          onClick={toggleModal}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-medium mb-4">Edit Habit</h2>
            <input
              type="text"
              value={habitName}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Habit name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
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
