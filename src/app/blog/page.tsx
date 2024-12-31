import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-5xl font-extrabold text-primary">Coming soon...</h1>
        <h2 className="mt-2 text-xl font-bold text-foreground">
          ✨ Exciting News! My Blog Feature is Launching Soon! 🎉
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          I&apos;m thrilled to announce that a brand-new blog section will be
          coming to my portfolio website! Stay tuned for updates
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/" className="inline-flex items-center">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Go back home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
