"use client";

import { useTransition } from "react";
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
        console.error(error);
        toast.error("Something went wrong. Please try again.");
        return;
      }
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      toastRefreshWarning(result);
      onSuccess?.(result.data);
    });
  }

  return { isPending, run };
}
