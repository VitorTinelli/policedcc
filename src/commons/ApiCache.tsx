import { useState, useEffect, useCallback } from 'react';
import { apiCall } from './ApiHelper';

interface CacheConfig {
  ttl?: number
  key: string;
}

interface UseApiCacheResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export function useApiCache<T>(
  url: string,
  options: RequestInit = {},
  config: CacheConfig
): UseApiCacheResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ttl = 5 * 60 * 1000, key } = config; 

  const clearCache = useCallback(() => {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_timestamp`);
  }, [key]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedData = localStorage.getItem(key);
      const cacheTimestamp = localStorage.getItem(`${key}_timestamp`);

      if (cachedData && cacheTimestamp) {
        const isValid = Date.now() - parseInt(cacheTimestamp) < ttl;
        if (isValid) {
          setData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }

      const response = await apiCall(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      localStorage.setItem(key, JSON.stringify(result));
      localStorage.setItem(`${key}_timestamp`, Date.now().toString());
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro na API:', err);
    } finally {
      setLoading(false);
    }
  }, [url, options, key, ttl]);

  const refetch = useCallback(async () => {
    clearCache();
    await fetchData();
  }, [clearCache, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
}

export function useMilitarProfile(email: string) {
  return useApiCache(
    `/api/profiles/getMilitarProfile?email=${encodeURIComponent(email)}`,
    { method: 'GET' },
    {
      key: `militar_profile_${email}`,
      ttl: 5 * 60 * 1000 
    }
  );
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
