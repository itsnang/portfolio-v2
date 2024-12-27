import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-2xl">
      <section>
        <div className="gap-5 flex items-center">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </section>

      <section className="pt-4 space-y-4">
        {/* About text skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* AboutImage skeleton */}
        <div className="columns-2 gap-4 sm:columns-3">
          {[...Array(6)].map((_, idx) => (
            <Skeleton
              key={idx}
              className="mb-4 w-full rounded-lg aspect-video"
            />
          ))}
        </div>
      </section>
      <section className="py-6">
        <Skeleton className="h-7 w-24 mb-4" />{" "}
        {/* Skeleton for the "Skills" heading */}
        <div className="flex pt-4 flex-wrap gap-3">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 rounded-md px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 bg-white dark:bg-gray-900 inline-flex items-center gap-1"
            >
              <Skeleton className="h-5 w-5 rounded-md" />{" "}
              {/* Skeleton for the skill logo */}
              <Skeleton className="h-4 w-16" />{" "}
              {/* Skeleton for the skill name */}
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-0 flex-col gap-y-3 py-6">
        <Skeleton className="h-7 w-48 mb-2" />{" "}
        {/* Skeleton for "Work Experience" heading */}
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 rounded-lg border p-3"
          >
            <Skeleton className="h-10 w-12 rounded-full" />{" "}
            {/* Skeleton for company logo */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />{" "}
              {/* Skeleton for company name */}
              <Skeleton className="h-4 w-1/3" /> {/* Skeleton for period */}
              <div className="space-y-1">
                <Skeleton className="h-3 w-full" />{" "}
                {/* Skeleton for description line 1 */}
                <Skeleton className="h-3 w-5/6" />{" "}
                {/* Skeleton for description line 2 */}
                <Skeleton className="h-3 w-4/5" />{" "}
                {/* Skeleton for description line 3 */}
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="flex min-h-0 flex-col gap-y-3 py-6">
        <Skeleton className="h-7 w-48 mb-2" />{" "}
        <Card className="flex p-4">
          <div className="flex-none">
            <Skeleton className="size-12 rounded-full" />
          </div>
          <div className="flex-grow ml-4 items-center flex-col">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-x-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/5" />
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
