import { AchievementSection } from "@/components/achievement-section";
import { getQueryClient } from "@/lib/tanstack/get-query-client";
import React from "react";
import { getSocials } from "../action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DockNavClient } from "@/components/nav-dock-client";

export default async function AchievementPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["socials"],
    queryFn: getSocials,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AchievementSection />
      <DockNavClient />
    </HydrationBoundary>
  );
}
