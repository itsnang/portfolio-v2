import type { Metadata } from "next";
import SignIn from "@/features/auth/components/signin";

// robots.txt already disallows crawling; noindex also keeps the URL itself out
// of results if it's ever linked from elsewhere.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <SignIn />
      </div>

      <aside
        aria-hidden
        className="relative m-2 hidden overflow-hidden rounded-2xl border border-border bg-muted lg:flex lg:flex-col"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 35%, rgb(255 255 255 / 0.45), transparent 70%), radial-gradient(45% 40% at 85% 95%, rgb(36 86 214 / 0.14), transparent 70%)",
        }}
      >
        <div className="flex flex-1 items-center justify-center px-12">
          <p className="select-none text-center text-[clamp(56px,7vw,112px)] font-medium leading-[0.9] tracking-[-0.045em]">
            lorn
            <br />
            <span className="text-primary">samnang</span>
            <span className="text-primary">.</span>
          </p>
        </div>
        <div className="px-10 pb-10">
          <p className="text-2xl font-medium tracking-[-0.02em]">Every save goes live.</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Edit the portfolio and the blog from one place. The public Sites refresh the moment you save.
          </p>
        </div>
      </aside>
    </main>
  );
}
