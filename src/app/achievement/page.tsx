import type { Metadata } from "next";
import { AchievementSection } from "@/features/achievement/components/achievement-section";
import { getQueryClient } from "@/lib/tanstack/get-query-client";
import React from "react";
import { getSocials } from "@/features/socials/actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DockNavClient } from "@/components/nav-dock-client";

const DESCRIPTION =
  "Awards, certifications, and career highlights from Lorn Samnang's journey as a software developer.";

export const metadata: Metadata = {
  title: "Achievements",
  description: DESCRIPTION,
  alternates: { canonical: "https://lornsamnang.com/achievement" },
  openGraph: {
    type: "website",
    url: "https://lornsamnang.com/achievement",
    title: "Achievements | Lorn Samnang",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Achievements | Lorn Samnang",
    description: DESCRIPTION,
  },
};

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
