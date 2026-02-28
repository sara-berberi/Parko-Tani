import { api } from './client';

export type Reservation = {
  id: string;
  parkingId: string;
  userId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'COMPLETED';
  startTime: string;
  expiresAt: string;
};

export async function createReservation(parkingId: string) {
  const { data } = await api.post<Reservation>('/reservations', { parkingId });
  return data;
}

export async function cancelReservation(id: string) {
  const { data } = await api.patch<Reservation>(`/reservations/${id}/cancel`);
  return data;
}

export async function myReservations() {
  const { data } = await api.get<Reservation[]>('/reservations/me');
  return data;
}
