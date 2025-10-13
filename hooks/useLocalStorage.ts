import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // On component mount, read from localStorage and set initialized flag.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
    } finally {
      setIsInitialized(true);
    }
  }, [key]);

  // When storedValue changes, update localStorage, but only after initialization.
  useEffect(() => {
    if (isInitialized) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error writing to localStorage: ${error}`);
      }
    }
  }, [key, storedValue, isInitialized]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;