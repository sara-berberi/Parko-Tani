import { api } from './client';

export type Parking = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  totalSpots: number;
  availableSpots: number;
};

export async function listNearby(params: { lat: number; lon: number; radius?: number }) {
  const { data } = await api.get<Parking[]>(`/parkings`, { params });
  return data;
}

export async function getParking(id: string) {
  const { data } = await api.get<Parking>(`/parkings/${id}`);
  return data;
}
