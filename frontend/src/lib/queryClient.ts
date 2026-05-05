import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,
      retry: (fc, e: unknown) => {
        const s = (e as any)?.response?.status;
        if (s === 401 || s === 403 || s === 404) return false;
        return fc < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});
