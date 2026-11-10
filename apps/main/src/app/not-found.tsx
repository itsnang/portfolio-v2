import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-extrabold text-primary">404</h1>
        <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Jum jg hack men?
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
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
      <div className="mt-12 max-w-lg">
        <svg
          className="w-full"
          viewBox="0 0 480 360"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="linearGradient-1"
              x1="50%"
              x2="50%"
              y1="0%"
              y2="100%"
            >
              <stop stopColor="hsl(var(--primary))" offset="0%"></stop>
              <stop stopColor="hsl(var(--primary) / 0.5)" offset="100%"></stop>
            </linearGradient>
          </defs>
          <path
            fill="url(#linearGradient-1)"
            fillRule="nonzero"
            d="M226 182c-9-6-7-22-7-22s-5-24-18-26c-13-3-21 6-21 6s-10 12-17 14c-7 1-20-4-20-4s-13-5-19 2c-6 6-4 18-4 18s2 12-1 17-13 14-13 14-14 11-7 23c7 13 25 16 25 16s20 4 28-3 13-18 13-18 10-14 16-16c6-1 21 2 21 2s13 3 19-5c6-9 2-21 2-21s-3-12 3-18z"
            opacity=".2"
          ></path>
          <path
            fill="hsl(var(--primary))"
            d="M225.2 181c-8.8-5.6-6.7-21.4-6.7-21.4s-5.2-23.8-17.6-25.9c-12.4-2.1-20.5 5.7-20.5 5.7s-10 11.7-16.7 13.7c-6.7 1-19.5-4.3-19.5-4.3s-12.9-4.7-18.6 1.9c-5.7 6.6-3.8 17.6-3.8 17.6s1.9 11.7-1 16.7-12.9 13.8-12.9 13.8-13.8 10.5-6.7 22.9c7.2 12.4 24.8 15.7 24.8 15.7s19.5 3.8 27.6-3.3 12.9-17.6 12.9-17.6 9.5-13.8 15.7-15.7c6.2-1 20.5 1.9 20.5 1.9s12.9 2.9 18.6-4.8c5.7-8.6 1.9-20.5 1.9-20.5s-2.9-11.7 2.9-17.6z"
          ></path>
          <path
            fill="hsl(var(--background))"
            d="M216.8 171.2c-7.2-4.6-5.5-17.6-5.5-17.6s-4.3-19.5-14.5-21.2c-10.2-1.7-16.8 4.7-16.8 4.7s-8.2 9.6-13.7 11.2c-5.5.8-16-3.5-16-3.5s-10.6-3.9-15.3 1.6c-4.7 5.4-3.1 14.5-3.1 14.5s1.6 9.6-.8 13.7-10.6 11.3-10.6 11.3-11.3 8.6-5.5 18.8c5.9 10.2 20.4 12.9 20.4 12.9s16 3.1 22.7-2.7 10.6-14.5 10.6-14.5 7.8-11.3 12.9-12.9c5.1-.8 16.8 1.6 16.8 1.6s10.6 2.4 15.3-3.9c4.7-7.1 1.6-16.8 1.6-16.8s-2.4-9.6 2.4-14.5z"
          ></path>
          <path
            fill="hsl(var(--muted-foreground))"
            d="M214.4 169c-6.6-4.2-5-16.1-5-16.1s-3.9-17.8-13.2-19.4c-9.3-1.6-15.4 4.3-15.4 4.3s-7.5 8.8-12.5 10.3c-5 .7-14.6-3.2-14.6-3.2s-9.7-3.6-14 1.5c-4.3 5-2.8 13.2-2.8 13.2s1.5 8.8-.7 12.5-9.7 10.3-9.7 10.3-10.3 7.9-5 17.2 18.6 11.8 18.6 11.8 14.6 2.8 20.7-2.5 9.7-13.2 9.7-13.2 7.1-10.3 11.8-11.8c4.7-.7 15.4 1.5 15.4 1.5s9.7 2.2 14-3.6c4.3-6.5 1.5-15.4 1.5-15.4s-2.2-8.8 2.2-13.2z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
