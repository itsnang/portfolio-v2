import { redirect } from "next/navigation";

// There's no overview page: the dashboard opens on the profile.
export default function DashboardPage() {
  redirect("/dashboard/profile");
}
