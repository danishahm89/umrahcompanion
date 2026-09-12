import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

const PREFIX = 'umrah-companion:';

/**
 * Device-local state that survives restarts (checklist ticks, theme/language/RTL prefs).
 * Distinct from the API-backed content hooks in `api/hooks.ts` — this is per-device state,
 * never admin-managed content.
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(PREFIX + key).then((raw) => {
      if (cancelled) return;
      if (raw != null) {
        try {
          setValue(JSON.parse(raw) as T);
        } catch {
          // ignore corrupt value, keep initialValue
        }
      }
      loaded.current = true;
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(PREFIX + key, JSON.stringify(value)).catch(() => {});
  }, [key, value]);

  return [value, setValue] as const;
}
