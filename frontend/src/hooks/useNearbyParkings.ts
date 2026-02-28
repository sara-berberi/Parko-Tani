import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { listNearby, Parking } from '../api/parkings';

export function useNearbyParkings(radiusKm = 2) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionError('Location permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
    })();
  }, []);

  const query = useQuery<Parking[], Error>({
    queryKey: ['nearby', coords?.lat, coords?.lon, radiusKm],
    queryFn: () => listNearby({ lat: coords!.lat, lon: coords!.lon, radius: radiusKm }),
    enabled: !!coords,
  });

  return { ...query, coords, permissionError };
}
