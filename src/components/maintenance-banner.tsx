import { TriangleAlert } from "lucide-react";

export function MaintenanceBanner() {
  return (
    <div className="w-full border-b border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5">
      <p className="flex items-center justify-center gap-2 text-xs text-yellow-500">
        <TriangleAlert className="size-3.5 shrink-0" />
        This site is currently undergoing maintenance. Some things may not work as expected.
      </p>
    </div>
  );
}
