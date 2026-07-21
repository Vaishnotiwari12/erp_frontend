import { useCallback, useEffect, useRef, useState } from 'react'

// Generic async data fetcher for service calls.
// Returns { data, isLoading, error, refetch } — drives loading/empty/error states.
// INTEGRATION: replace with TanStack Query when a query client is added.
export function useAsyncData(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current()
      // Unwrap the { success, data, message } envelope returned by services.
      setData(result?.data !== undefined ? result.data : result)
    } catch (e) {
      setError(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError(null)
    fetcherRef
      .current()
      .then((result) => {
        if (active) setData(result?.data !== undefined ? result.data : result)
      })
      .catch((e) => {
        if (active) setError(e)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, isLoading, error, refetch }
}

export default useAsyncData
