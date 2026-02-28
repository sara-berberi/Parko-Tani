import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useReservation } from '../hooks/useReservation';
import dayjs from 'dayjs';

export default function ReservationScreen() {
  const { reservations, isLoading, error, cancel, canceling } = useReservation();
  const active = reservations.find((r) => r.status === 'ACTIVE');
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!active) return;
    const update = () => {
      const expires = dayjs(active.expiresAt);
      setRemaining(Math.max(0, expires.diff(dayjs(), 'second')));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [active]);

  const minutes = useMemo(() => Math.floor(remaining / 60), [remaining]);
  const seconds = useMemo(() => remaining % 60, [remaining]);

  if (isLoading) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (error) return <View style={styles.center}><Text>Error loading reservations</Text></View>;

  return (
    <View style={styles.container}>
      {active ? (
        <Card>
          <Card.Title title="Active Reservation" subtitle={`Parking: ${active.parkingId}`} />
          <Card.Content>
            <Text>Expires in {minutes}m {seconds}s</Text>
            <Text>Status: {active.status}</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={() => cancel(active.id)} loading={canceling}>
              Cancel
            </Button>
          </Card.Actions>
        </Card>
      ) : (
        <Text>No active reservation.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
