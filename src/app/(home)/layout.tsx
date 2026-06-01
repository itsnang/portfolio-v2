import { generateMetadata as buildMetadata } from "@/lib/metadata";
import { getAppConfig, getProfile } from "@/app/action";
import type { Metadata } from "next";

export const revalidate = 60;

function toOgImageUrl(url: string): string {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace(/\/upload\//, "/upload/w_1200,h_630,c_fill,g_face/");
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const description =
    profile.bio ??
    `${profile.name} is a software developer. Explore projects, skills, and professional journey.`;
  return buildMetadata({
    title: `${profile.name} | Software Developer`,
    description,
    imageUrl: toOgImageUrl(profile.imageUrl),
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
