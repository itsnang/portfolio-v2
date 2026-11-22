import type { Metadata } from "next";
import { AchievementSection } from "@/features/achievement/components/achievement-section";
import React from "react";
import { getSocials } from "@/features/socials/queries";
import { DockNavClient } from "@/components/nav-dock-client";
import { blogUrl, mainPageUrl } from "@/lib/site-urls";

const DESCRIPTION =
  "Awards, certifications, and career highlights from Lorn Samnang's journey as a software developer.";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Achievements",
  description: DESCRIPTION,
  alternates: { canonical: mainPageUrl("/achievement") },
  openGraph: {
    type: "website",
    url: mainPageUrl("/achievement"),
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
  const socials = await getSocials();

  return (
    <>
      <AchievementSection />
      <DockNavClient socials={socials} blogUrl={blogUrl} />
    </>
  );
}
