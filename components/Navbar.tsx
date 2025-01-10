"use client"

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              MyBrand
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
          <Link href="/" className="block hover:bg-gray-700 rounded px-3 py-2">
              Home
            </Link>
            <Link href="/tasks" className="block hover:bg-gray-700 rounded px-3 py-2">
              Tasks
            </Link>
            <Link href="/" className="block hover:bg-gray-700 rounded px-3 py-2">
              Habits
            </Link>
            <Link href="/timer" className="block hover:bg-gray-700 rounded px-3 py-2">
              Timer
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block hover:bg-gray-700 rounded px-3 py-2">
              Home
            </Link>
            <Link href="/tasks" className="block hover:bg-gray-700 rounded px-3 py-2">
              Tasks
            </Link>
            <Link href="/" className="block hover:bg-gray-700 rounded px-3 py-2">
              Habits
            </Link>
            <Link href="/timer" className="block hover:bg-gray-700 rounded px-3 py-2">
              Timer
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
