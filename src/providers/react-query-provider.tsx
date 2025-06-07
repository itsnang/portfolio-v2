"use client";

import { getQueryClient } from "@/lib/tanstack/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { type PropsWithChildren } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const ReactQueryProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools buttonPosition="top-left" />
    </QueryClientProvider>
  );
};
