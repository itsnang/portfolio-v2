"use client";

import * as React from "react";
import { DollarSign } from "lucide-react";

interface NavBarProps {
  isAvailable: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ isAvailable }) => {
  return (
    <nav className="flex justify-end items-center mb-6">
      {isAvailable ? (
        <span className="inline-flex items-center font-medium rounded-md text-xs px-2 py-1 bg-primary/25 dark:bg-primary/25 dark:bg-opacity-10 text-primary dark:text-primary-400 ring-1 ring-inset ring-primary dark:ring-primary ring-opacity-25 dark:ring-opacity-25">
          Available for Work <DollarSign className="ml-1" size={16} />
        </span>
      ) : null}
    </nav>
  );
};
