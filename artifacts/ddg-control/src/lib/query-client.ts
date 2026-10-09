import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { handleUnauthorizedError, isUnauthorizedError } from './errors';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleUnauthorizedError }),
  mutationCache: new MutationCache({ onError: handleUnauthorizedError }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        isUnauthorizedError(error) ? false : failureCount < 3,
    },
  },
});
