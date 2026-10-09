import { queryClient } from '../App';
import { setAuthenticationRequired } from '../components/auth';

export function isUnauthorizedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as {
    status?: number;
    statusCode?: number;
    response?: { status?: number };
  };
  return candidate.status === 401
    || candidate.statusCode === 401
    || candidate.response?.status === 401;
}

export function handleUnauthorizedError(error: unknown): void {
  if (!isUnauthorizedError(error)) return;
  queryClient.clear();
  setAuthenticationRequired(true);
}

export function isNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as {
    status?: number;
    statusCode?: number;
    response?: { status?: number };
    data?: { error?: string };
    error?: string;
  };
  return candidate.status === 404
    || candidate.statusCode === 404
    || candidate.response?.status === 404
    || candidate.data?.error === 'not found'
    || candidate.error === 'not found';
}

export function serverErrorText(error: unknown, fallback = 'Unable to save project.'): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof data.error === 'string'
    ) {
      return data.error;
    }
  }
  return error instanceof Error ? error.message : fallback;
}
