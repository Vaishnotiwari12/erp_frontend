import { useCallback, useEffect, useState } from 'react'

// Debounce a fast-changing value (e.g. search input).
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default useDebounce
