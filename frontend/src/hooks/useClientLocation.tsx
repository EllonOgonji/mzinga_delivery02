import { loadEnvFile } from 'process';
import { useState, useCallback } from 'react';

export const useClientLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
    locationLoading: false
  });

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

    // Set loading to true when starting to fetch location
    setLocation(prev => ({ ...prev, locationLoading: true, error: null }));

    const success = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        locationLoading: false
      });
    };

    const error = (error) => {
      setLocation({
        latitude: null,
        longitude: null,
        error: error.message,
        locationLoading: false
      });
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    // Request location when called
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []); // Empty dependency array since it doesn't depend on any props/state

  console.log(location.latitude, location.longitude)

  return {
    ...location,
    getLocation // Return the function to trigger location fetch
  };
};