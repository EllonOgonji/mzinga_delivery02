import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export const useClientLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
    locationLoading: false
  });
  const retryCountRef = useRef(0);

  const getLocation = useCallback(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser',
        locationLoading: false
      });
      return;
    }

    // Reset retry count on fresh call
    retryCountRef.current = 0;

    // Set loading to true when starting to fetch location
    setLocation(prev => ({ ...prev, locationLoading: true, error: null }));

    const attempt = (useHighAccuracy: boolean = true) => {
      const options = {
        enableHighAccuracy: useHighAccuracy,
        timeout: useHighAccuracy ? 10000 : 15000,
        maximumAge: 0
      };

      const success = (position) => {
        retryCountRef.current = 0;
        setLocation({
          latitude: Math.round(position.coords.latitude * 1e6) / 1e6,
          longitude: Math.round(position.coords.longitude * 1e6) / 1e6,
          error: null,
          locationLoading: false
        });
      };

      const error = (err) => {
        retryCountRef.current += 1;

        if (retryCountRef.current < MAX_RETRIES) {
          // On second retry, fall back to low accuracy for broader compatibility
          const fallbackAccuracy = retryCountRef.current >= 2 ? false : useHighAccuracy;
          setTimeout(() => attempt(fallbackAccuracy), RETRY_DELAY_MS);
        } else {
          // Max retries reached — try watchPosition as a last resort
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              navigator.geolocation.clearWatch(watchId);
              setLocation({
                latitude: Math.round(position.coords.latitude * 1e6) / 1e6,
                longitude: Math.round(position.coords.longitude * 1e6) / 1e6,
                error: null,
                locationLoading: false
              });
            },
            () => {
              navigator.geolocation.clearWatch(watchId);
              setLocation({
                latitude: null,
                longitude: null,
                error: err.message,
                locationLoading: false
              });
              toast.error('Unable to get your location. Please check your location permissions and try again.');
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
          );

          // Safety timeout to clear watch if it hangs
          setTimeout(() => {
            navigator.geolocation.clearWatch(watchId);
          }, 25000);
        }
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    };

    attempt(true);
  }, []);

  return {
    ...location,
    getLocation
  };
};