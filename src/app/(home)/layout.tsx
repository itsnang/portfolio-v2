export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="antialiased max-w-4xl space-y-12 py-5 px-7 mx-auto md:my-[18vh] min-h-screen">
      {children}
    </main>
  );
}
