"use client";

import {
  environmentManager,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ApiError } from "@/lib/apiClient";
import { queryKeys } from "@/lib/query-keys";

function makeQueryClient() {
  const queryClient: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      /**
       * A 401 here means the silent token refresh already failed, i.e. the session is over.
       * Re-check the session so the route guards send the user to /login instead of
       * leaving them on a page full of error states.
       */
      onError: (error, query) => {
        const isSessionQuery = query.queryKey[0] === queryKeys.me[0];
        if (
          error instanceof ApiError &&
          error.status === 401 &&
          !isSessionQuery
        ) {
          queryClient.invalidateQueries({ queryKey: queryKeys.me });
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (
            error instanceof ApiError &&
            error.status >= 400 &&
            error.status < 500
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });

  return queryClient;
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export default function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
