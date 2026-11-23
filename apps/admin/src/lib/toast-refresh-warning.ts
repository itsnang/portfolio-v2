import { toast } from "sonner";
import type { ActionResult } from "@/lib/admin-action";

/** Shows the warning a save returns when public pages couldn't be refreshed. */
export function toastRefreshWarning<T>(result: ActionResult<T>) {
  if (result.success && result.warning) toast.warning(result.warning);
}
