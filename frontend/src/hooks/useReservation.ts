import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelReservation, createReservation, myReservations } from '../api/reservations';
import { useEffect } from 'react';
import { socket } from '../utils/socket';

export function useReservation() {
  const qc = useQueryClient();

  const reservationsQuery = useQuery({ queryKey: ['reservations'], queryFn: myReservations });

  const createMut = useMutation({
    mutationFn: (parkingId: string) => createReservation(parkingId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });

  const cancelMut = useMutation({
    mutationFn: (id: string) => cancelReservation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });

  useEffect(() => {
    const handler = () => qc.invalidateQueries({ queryKey: ['reservations'] });
    socket.on('reservation.update', handler);
    return () => {
      socket.off('reservation.update', handler);
    };
  }, [qc]);

  return {
    reservations: reservationsQuery.data || [],
    isLoading: reservationsQuery.isLoading,
    error: reservationsQuery.error,
    create: createMut.mutateAsync,
    cancel: cancelMut.mutateAsync,
    creating: createMut.isPending,
    canceling: cancelMut.isPending,
  };
}
