"use client";

import React, { useState } from "react";
import Link from "next/link";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from "@clerk/nextjs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
      <nav className="bg-gray-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <div className="hidden space-x-4 md:flex">
              <Link
                href="/"
                className="block rounded px-3 py-2 hover:bg-gray-700"
              >
                Home
              </Link>
              <Link
                href="/tasks"
                className="block rounded px-3 py-2 hover:bg-gray-700"
              >
                Tasks
              </Link>
              <Link
                href="/"
                className="block rounded px-3 py-2 hover:bg-gray-700"
              >
                Habits
              </Link>
              <Link
                href="/timer"
                className="block rounded px-3 py-2 hover:bg-gray-700"
              >
                Timer
              </Link>
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white focus:text-white focus:outline-none"
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
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <Link
                href="/"
                className="block rounded px-3 py-2 hover:bg-gray-700"
              >
                Home
              </Link>
              <Link
                href="/tasks"
                className="block rounded px-3 py-2 hover:bg-gray-700"
              >
                Tasks
              </Link>
              <Link
                href="/"
                className="block rounded px-3 py-2 hover:bg-gray-700"
              >
                Habits
              </Link>
              <Link
                href="/timer"
                className="block rounded px-3 py-2 hover:bg-gray-700"
              >
                Timer
              </Link>
            </div>
          </div>
        )}
      </nav>
  );
};

export default Navbar;
