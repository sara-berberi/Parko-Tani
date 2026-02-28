import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getParking } from '../api/parkings';
import { useReservation } from '../hooks/useReservation';
import { RootStackParamList } from '../navigation';

export default function ParkingDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ParkingDetail'>>();
  const { parkingId } = route.params;
  const { create, creating } = useReservation();
  const { data, isLoading, error } = useQuery({ queryKey: ['parking', parkingId], queryFn: () => getParking(parkingId) });

  if (isLoading) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (error || !data) return <View style={styles.center}><Text>Error loading parking</Text></View>;

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={data.name} subtitle={data.address} />
        <Card.Content>
          <Text>Available spots: {data.availableSpots} / {data.totalSpots}</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" loading={creating} onPress={() => create(data.id)} disabled={data.availableSpots <= 0}>
            Reserve 30 mins
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
