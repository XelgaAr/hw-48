import { useEffect, useState } from 'react';
import { browserStorage, readJson, writeJson } from '../lib/storage.js';

/** State remains usable when storage is unavailable or full. */
export function usePersistentState(key, initialValue, validate) {
  const [value, setValue] = useState(() => readJson(browserStorage(), key, initialValue, validate));
  const [storageFailed, setStorageFailed] = useState(false);
  useEffect(() => {
    setStorageFailed(!writeJson(browserStorage(), key, value));
  }, [key, value]);
  return [value, setValue, storageFailed];
}
