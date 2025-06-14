import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分間はデータを新鮮と見なす
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
