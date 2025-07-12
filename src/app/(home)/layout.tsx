import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Home | Lorn Samnang",
  description:
    "Welcome to the portfolio of Lorn Samnang. Explore my projects, skills, and professional journey.",
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="antialiased max-w-4xl space-y-12 py-5 px-4 lg:px-7 mx-auto min-h-screen mb-16">
      {children}
    </main>
  );
}
