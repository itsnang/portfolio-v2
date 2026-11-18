import { toast } from "sonner";

/** Shows the warning a save returns when public pages couldn't be refreshed. */
export function toastRefreshWarning(result: object) {
  if ("warning" in result && typeof result.warning === "string") {
    toast.warning(result.warning);
  }
}
