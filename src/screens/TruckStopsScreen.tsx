import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {TruckStop, Location} from '../types';
import {TruckStopService} from '../services/TruckStopService';
import {LocationService} from '../services/LocationService';
import {useVoice} from '../contexts/VoiceContext';
import VoiceButton from '../components/VoiceButton';
import Button from '../components/Button';

const TruckStopsScreen: React.FC = () => {
  const [truckStops, setTruckStops] = useState<TruckStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const {speak} = useVoice();

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const hasPermission = await LocationService.requestPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to find nearby truck stops.',
        );
        return;
      }

      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);
      await findNearbyStops(location);
    } catch (error) {
      Alert.alert('Error', 'Failed to get your location');
      console.error(error);
    }
  };

  const findNearbyStops = async (location: Location) => {
    setLoading(true);
    try {
      const stops = await TruckStopService.findNearbyTruckStops(location, 50);
      setTruckStops(stops);
      
      if (stops.length === 0) {
        speak('No truck stops found within 50 miles');
      } else {
        speak(`Found ${stops.length} truck stops nearby`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to find truck stops');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSearch = (query: string) => {
    searchTruckStops(query);
  };

  const searchTruckStops = async (query: string) => {
    setLoading(true);
    try {
      const stops = await TruckStopService.searchTruckStops(query);
      setTruckStops(stops);
      speak(`Found ${stops.length} truck stops matching your search`);
    } catch (error) {
      Alert.alert('Error', 'Failed to search truck stops');
    } finally {
      setLoading(false);
    }
  };

  const refreshStops = () => {
    if (currentLocation) {
      findNearbyStops(currentLocation);
    } else {
      initializeLocation();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Truck Stops</Text>
        <Text style={styles.subtitle}>
          Say a location or amenity to search
        </Text>
      </View>

      <VoiceButton
        onResult={handleVoiceSearch}
        prompt="What truck stop are you looking for?"
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Refresh Nearby Stops"
          onPress={refreshStops}
          loading={loading}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
        </View>
      )}

      {!loading && truckStops.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No truck stops found. Try refreshing or searching.
          </Text>
        </View>
      )}

      {!loading && truckStops.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {truckStops.length} Truck Stops Found
          </Text>
          {truckStops.map(stop => (
            <View key={stop.id} style={styles.stopCard}>
              <Text style={styles.stopName}>{stop.name}</Text>
              <Text style={styles.stopAddress}>{stop.address}</Text>
              {stop.distance !== undefined && (
                <Text style={styles.distance}>
                  {stop.distance.toFixed(1)} miles away
                </Text>
              )}
              <View style={styles.amenitiesContainer}>
                {stop.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  stopCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  stopAddress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  distance: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  amenityTag: {
    backgroundColor: '#ECF0F1',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 5,
  },
  amenityText: {
    fontSize: 12,
    color: '#2C3E50',
  },
});

export default TruckStopsScreen;
