"use client";

import { useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/admin-action";
import { toastRefreshWarning } from "@/lib/toast-refresh-warning";

/**
 * Runs an Admin Site action from a form or table: tracks pending state and
 * shows the result's error, success message and refresh warning. `onSuccess`
 * runs only when the save succeeded. The action's own revalidation refreshes
 * the page, so callers don't call router.refresh().
 */
export function useRunAction() {
  const [isPending, startTransition] = useTransition();

  function run<T>(action: () => Promise<ActionResult<T>>, onSuccess?: (data: T) => void) {
    startTransition(async () => {
      let result: ActionResult<T>;
      try {
        result = await action();
      } catch (error) {
        // An expired session redirects to /sign-in by rejecting the action; let Next handle it.
        unstable_rethrow(error);
        console.error(error);
        toast.error("Something went wrong. Please try again.");
        return;
      }
      if (showActionResult(result)) onSuccess?.(result.data);
    });
  }

  return { isPending, run };
}

/** Shows an action's error, or its success message and any refresh warning. Returns whether it succeeded. */
export function showActionResult<T>(result: ActionResult<T>): result is Extract<ActionResult<T>, { success: true }> {
  if (!result.success) {
    toast.error(result.error);
    return false;
  }
  toast.success(result.message);
  toastRefreshWarning(result);
  return true;
}
