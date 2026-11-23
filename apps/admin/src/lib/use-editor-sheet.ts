"use client";

import { useState } from "react";

/** Open/close state for a table's create-or-edit sheet. `editing` is null when creating. */
export function useEditorSheet<T>() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);

  return {
    open,
    editing,
    setOpen,
    openCreate: () => {
      setEditing(null);
      setOpen(true);
    },
    openEdit: (item: T) => {
      setEditing(item);
      setOpen(true);
    },
    close: () => setOpen(false),
  };
}
