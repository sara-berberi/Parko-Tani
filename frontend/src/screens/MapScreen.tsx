import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useNearbyParkings } from '../hooks/useNearbyParkings';
import { socket } from '../utils/socket';
import { useQueryClient } from '@tanstack/react-query';

export default function MapScreen() {
  const { data, isLoading, permissionError } = useNearbyParkings();
  const nav = useNavigation<any>();
  const qc = useQueryClient();

  useEffect(() => {
    const handler = () => qc.invalidateQueries({ queryKey: ['nearby'] });
    socket.on('parking.update', handler);
    return () => {
      socket.off('parking.update', handler);
    };
  }, [qc]);

  return (
    <View style={styles.container}>
      {permissionError ? <Text>{permissionError}</Text> : null}
      {isLoading && <Text>Loading nearby parkings...</Text>}
      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => nav.navigate('ParkingDetail', { parkingId: item.id })}>
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={item.address} />
              <Card.Content>
                <Text>Available: {item.availableSpots} / {item.totalSpots}</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => nav.navigate('ParkingDetail', { parkingId: item.id })}>
                  View
                </Button>
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  card: { marginBottom: 12 },
});
