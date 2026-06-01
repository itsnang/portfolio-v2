import { generateMetadata as buildMetadata } from "@/lib/metadata";
import { getAppConfig, getProfile } from "@/app/action";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return buildMetadata({
    title: `${profile.name} | Software Developer`,
    description: profile.bio ?? profile.abouts,
    imageUrl: profile.imageUrl,
  });
}

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getAppConfig();

  if (config.theme === "wireframe") {
    return <>{children}</>;
  }

  return (
    <main className="antialiased max-w-4xl space-y-12 py-5 px-4 lg:px-7 mx-auto min-h-screen mb-16">
      {children}
    </main>
  );
}
