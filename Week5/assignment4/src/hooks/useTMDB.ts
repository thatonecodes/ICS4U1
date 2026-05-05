import { useState, useEffect, useCallback } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(fetchFn: () => Promise<T>, deps: React.DependencyList = []) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(() => {
    setState({ data: null, loading: true, error: null });
    fetchFn()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => setState({ data: null, loading: false, error: err.message || 'Something went wrong' }));
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
