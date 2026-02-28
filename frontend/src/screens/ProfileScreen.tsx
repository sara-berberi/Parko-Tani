import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useAuth } from '../state/useAuth';
import { useReservation } from '../hooks/useReservation';
import { useNotifications } from '../hooks/useNotifications';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { reservations } = useReservation();
  const { token, error } = useNotifications();

  useEffect(() => {
    // side-effect is handled in hook
  }, [token]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={user?.name || 'Driver'} subtitle={user?.email} />
        <Card.Content>
          <Text>Role: {user?.role}</Text>
          <Text>Push token: {token ? 'Registered' : 'Not registered'}</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={logout}>
            Logout
          </Button>
        </Card.Actions>
      </Card>

      <Text variant="titleMedium" style={styles.heading}>
        Reservation History
      </Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={`Parking ${item.parkingId}`} subtitle={item.status} />
            <Card.Content>
              <Text>Start: {new Date(item.startTime).toLocaleString()}</Text>
              <Text>Expires: {new Date(item.expiresAt).toLocaleString()}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 12 },
  heading: { marginVertical: 8 },
  error: { color: 'red', marginTop: 4 },
});
