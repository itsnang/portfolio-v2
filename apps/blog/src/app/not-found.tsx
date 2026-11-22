import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@portfolio/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-extrabold text-primary">404</h1>
        <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Jum jg hack men?
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Sorry, we couldn&apos;t find the post you&apos;re looking for.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to the blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
