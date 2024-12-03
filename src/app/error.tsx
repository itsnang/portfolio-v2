"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <AlertTriangle
          className="mx-auto h-12 w-12 text-red-500"
          aria-hidden="true"
        />
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Oops! Something went wrong
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          We apologize for the inconvenience. Please try again later.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
        {error && error.digest && (
          <p className="mt-4 text-sm text-muted-foreground">
            Error ID: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </div>
    </div>
  );
}
