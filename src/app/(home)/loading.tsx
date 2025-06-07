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
    <main className="w-full max-w-4xl min-h-screen">
      <div className="w-full lg:h-56 md:h-44 h-40 relative mb-[114px] block rounded-lg">
        {/* Skeleton for cover image */}
        <Skeleton className="w-full h-full rounded-lg" />
        <section>
          {/* Skeleton for profile */}
          <div className="gap-2 flex flex-col absolute -bottom-[112px] left-6">
            {/* Skeleton for avatar */}
            <Skeleton className="size-28 rounded-full" />
            <div className="space-y-1">
              {/* Skeleton for name */}
              <Skeleton className="h-6 w-32" />
              {/* Skeleton for bio */}
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </section>
      </div>
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
              className="mb-4 w-full rounded-lg aspect-3/4"
            />
          ))}
        </div>
      </section>
      <section className="py-6">
        <Skeleton className="h-7 w-24 mb-4" />{" "}
        {/* Skeleton for the "Skills" heading */}
        <div className="flex pt-4 flex-wrap gap-3">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className="shrink-0 rounded-md px-3 py-2 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 bg-white dark:bg-gray-900 inline-flex items-center gap-1"
            >
              <Skeleton className="h-5 w-5 rounded-md" />{" "}
              {/* Skeleton for the skill logo */}
              <Skeleton className="h-4 w-[55px]" />{" "}
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
        <Skeleton className="h-7 w-48 mb-2" />
        <Card className="flex p-4">
          <div className="flex-none">
            <Skeleton className="size-12 rounded-full" />
          </div>
          <div className="grow ml-4 items-start flex-col">
            {" "}
            {/* Changed items-center to items-start */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-x-2">
                {" "}
                {/* Changed justify-between */}
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/5" />
            </div>
          </div>
        </Card>
      </section>
      <section className="flex flex-col gap-y-3 py-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="flex w-full flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full"
            >
              <Skeleton className="h-40 w-full" />
              <CardHeader className="px-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col px-4">
                <div className="mt-2 flex flex-wrap gap-1">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-5 w-16" />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-4 pb-4">
                <div className="flex flex-row flex-wrap items-start gap-1">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-6 w-20" />
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
