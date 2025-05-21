import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <section className="pt-4 space-y-4">
      {/* Title skeleton */}
      <div className="flex justify-center mb-12">
        <Skeleton className="h-10 w-64" />
      </div>

      {/* Filter badges skeleton */}
      <div className="space-y-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
        </div>

        {/* Achievement cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="h-full overflow-hidden border-2">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <div className="mt-2 flex flex-row flex-wrap items-start gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
