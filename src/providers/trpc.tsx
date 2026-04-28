import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import type { ReactNode } from "react";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient();

// Support separate frontend/backend hosting:
// - Railway backend: set VITE_API_URL=https://askmian-api.railway.app/api/trpc
// - Same server (default): /api/trpc
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD && window.location.hostname !== 'localhost'
    ? '/api/trpc'
    : '/api/trpc');

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: API_URL,
      transformer: superjson,
      headers() {
        return {
          "x-admin-token": localStorage.getItem("adminToken") || "",
        };
      },
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
