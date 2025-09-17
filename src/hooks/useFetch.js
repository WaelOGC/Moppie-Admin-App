import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for making API requests with loading and error states
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @param {boolean} immediate - Whether to fetch immediately
 * @returns {object} Hook state and methods
 */
export const useFetch = (url, options = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (customUrl = url, customOptions = options) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(customUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...customOptions.headers,
        },
        ...customOptions,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [immediate, url, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    fetchData,
  };
};
