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

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const attempt = () => {
      const success = (position) => {
        retryCountRef.current = 0;
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          locationLoading: false
        });
      };

      const error = (err) => {
        retryCountRef.current += 1;

        if (retryCountRef.current < MAX_RETRIES) {
          // Retry after a delay
          setTimeout(attempt, RETRY_DELAY_MS);
        } else {
          // Max retries reached
          setLocation({
            latitude: null,
            longitude: null,
            error: err.message,
            locationLoading: false
          });
          toast.error('Unable to get your location. Please check your location permissions and try again.');
        }
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    };

    attempt();
  }, []); // Empty dependency array since it doesn't depend on any props/state
  console.log(location)
  return {
    ...location,
    getLocation // Return the function to trigger location fetch
  };
};