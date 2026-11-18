import type { Metadata } from "next";
import SignIn from "@/features/auth/components/signin";

// robots.txt already disallows crawling; noindex also keeps the URL itself out
// of results if it's ever linked from elsewhere.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

function Login() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <SignIn />
    </div>
  );
}

export default Login;
