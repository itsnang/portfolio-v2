import { generateMetadata } from "@/lib/metadata";
import { getAppConfig } from "@/app/action";

export const revalidate = 60;

export const metadata = generateMetadata({
  title: "Home",
  description:
    "Welcome to the portfolio of Lorn Samnang. Explore my projects, skills, and professional journey.",
});

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
