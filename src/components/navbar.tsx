"use client";

import * as React from "react";
import { DollarSign } from "lucide-react";

export const NavBar = () => {
  return (
    <nav className="flex justify-end items-center">
      <span className="inline-flex items-center font-medium rounded-md text-xs px-2 py-1 bg-primary/25 dark:bg-primary/25 dark:bg-opacity-10 text-primary dark:text-primary-400 ring-1 ring-inset ring-primary dark:ring-primary ring-opacity-25 dark:ring-opacity-25">
        Available for Work <DollarSign className="ml-1" size={16} />
      </span>
    </nav>
  );
};
