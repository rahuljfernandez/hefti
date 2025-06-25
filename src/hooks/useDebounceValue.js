import { useState, useEffect } from 'react';

export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // cancel timeout on value change or unmount
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
