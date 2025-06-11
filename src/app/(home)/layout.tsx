export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="antialiased max-w-4xl space-y-12 py-5 px-4 lg:px-7 mx-auto min-h-screen">
      {children}
    </main>
  );
}
