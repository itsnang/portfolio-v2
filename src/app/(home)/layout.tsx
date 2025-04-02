export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="antialiased max-w-3xl space-y-12 border-gray-700 md:border-2 md:rounded-xl py-5 px-7 mx-auto md:my-[20vh] min-h-screen">
      {children}
    </main>
  );
}
