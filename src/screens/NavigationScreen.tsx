import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {Location} from '../types';
import {LocationService} from '../services/LocationService';
import {useVoice} from '../contexts/VoiceContext';
import VoiceButton from '../components/VoiceButton';
import Button from '../components/Button';

const NavigationScreen: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [route, setRoute] = useState<Location[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const {speak} = useVoice();

  useEffect(() => {
    initializeLocation();
    return () => {
      if (watchId !== null) {
        LocationService.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const initializeLocation = async () => {
    try {
      const hasPermission = await LocationService.requestPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Location permission is needed for navigation.',
        );
        return;
      }

      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);

      // Start watching location
      const id = LocationService.watchPosition(newLocation => {
        setCurrentLocation(newLocation);
      });
      setWatchId(id);

      speak('Navigation is ready. Where would you like to go?');
    } catch (error) {
      Alert.alert('Error', 'Failed to get your location');
      console.error(error);
    }
  };

  const handleVoiceDestination = (query: string) => {
    // In a real app, this would geocode the address
    // For now, we'll just acknowledge the command
    speak(`Searching for route to ${query}. In a production app, this would use a geocoding service.`);
  };

  const calculateDistance = () => {
    if (currentLocation && destination) {
      const distance = LocationService.calculateDistance(
        currentLocation,
        destination,
      );
      speak(`Distance to destination is ${distance.toFixed(1)} miles`);
      Alert.alert(
        'Distance',
        `${distance.toFixed(1)} miles to destination`,
      );
    } else {
      Alert.alert('Error', 'Please set both current location and destination');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Navigation</Text>
        <Text style={styles.subtitle}>
          Say your destination address
        </Text>
      </View>

      <VoiceButton
        onResult={handleVoiceDestination}
        prompt="Where would you like to go?"
      />

      {currentLocation && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}>
            <Marker
              coordinate={currentLocation}
              title="Your Location"
              pinColor="blue"
            />
            {destination && (
              <Marker
                coordinate={destination}
                title="Destination"
                pinColor="red"
              />
            )}
            {route.length > 0 && (
              <Polyline
                coordinates={route}
                strokeWidth={4}
                strokeColor="#3498DB"
              />
            )}
          </MapView>
        </View>
      )}

      {currentLocation && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Current Location</Text>
          <Text style={styles.infoText}>
            Lat: {currentLocation.latitude.toFixed(4)}
          </Text>
          <Text style={styles.infoText}>
            Lon: {currentLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}

      {destination && (
        <View style={styles.buttonContainer}>
          <Button
            title="Calculate Distance"
            onPress={calculateDistance}
          />
        </View>
      )}

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Navigation Features</Text>
        <Text style={styles.instructionsText}>
          • Real-time GPS tracking{'\n'}
          • Turn-by-turn directions (in full version){'\n'}
          • Route distance calculation{'\n'}
          • Traffic updates (in full version){'\n'}
          • Voice-guided navigation{'\n'}
          {'\n'}
          <Text style={styles.note}>
            Note: This MVP shows the navigation interface. In production,
            this would integrate with Google Maps or similar service for
            full routing capabilities.
          </Text>
        </Text>
      </View>
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
  mapContainer: {
    height: 300,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 22,
  },
  note: {
    fontStyle: 'italic',
    color: '#95A5A6',
  },
});

export default NavigationScreen;
