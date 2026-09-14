import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { usePersistentState } from '../storage/usePersistentState';

export interface AppLocation {
  lat: number;
  lng: number;
  label: string;
}

interface LocationContextValue {
  location: AppLocation | null;
  loading: boolean;
  error: string | null;
  useDeviceLocation: () => Promise<void>;
  setManualCity: (query: string) => Promise<void>;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = usePersistentState<AppLocation | null>('home-location', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ask for location access once, right when the app opens, so prayer times / Qibla /
  // nearby-mosques all have a starting point. Falls back to Delhi if denied or unavailable.
  const askedOnStart = useRef(false);
  useEffect(() => {
    if (askedOnStart.current) return;
    askedOnStart.current = true;
    if (location !== null) return;
    (async () => {
      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          let label = 'Current location';
          try {
            const [place] = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            if (place) label = [place.city, place.region].filter(Boolean).join(', ') || label;
          } catch {
            // reverse geocoding is best-effort
          }
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, label });
        } else {
          setLocation({ lat: 28.6139, lng: 77.209, label: 'Delhi' });
        }
      } catch {
        setLocation({ lat: 28.6139, lng: 77.209, label: 'Delhi' });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useDeviceLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('permission-denied');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      let label = 'Current location';
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        if (place) label = [place.city, place.region].filter(Boolean).join(', ') || label;
      } catch {
        // reverse geocoding is best-effort — keep the generic label if it fails
      }
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, label });
    } catch {
      setError('location-failed');
    } finally {
      setLoading(false);
    }
  };

  const setManualCity = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Location.geocodeAsync(query);
      if (results.length === 0) {
        setError('not-found');
        return;
      }
      setLocation({ lat: results[0].latitude, lng: results[0].longitude, label: query.trim() });
    } catch {
      setError('not-found');
    } finally {
      setLoading(false);
    }
  };

  const clearLocation = () => setLocation(null);

  return (
    <LocationContext.Provider value={{ location, loading, error, useDeviceLocation, setManualCity, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useAppLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useAppLocation must be used within a LocationProvider');
  return ctx;
}
