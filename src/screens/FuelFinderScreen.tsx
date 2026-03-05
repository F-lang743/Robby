import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {FuelStation, Location} from '../types';
import {FuelService} from '../services/FuelService';
import {LocationService} from '../services/LocationService';
import {useVoice} from '../contexts/VoiceContext';
import VoiceButton from '../components/VoiceButton';
import Button from '../components/Button';

const FuelFinderScreen: React.FC = () => {
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([]);
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
          'Location permission is needed to find fuel prices.',
        );
        return;
      }

      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);
      await findCheapestFuel(location);
    } catch (error) {
      Alert.alert('Error', 'Failed to get your location');
      console.error(error);
    }
  };

  const findCheapestFuel = async (location: Location) => {
    setLoading(true);
    try {
      const stations = await FuelService.findCheapestFuel(location, 50);
      setFuelStations(stations);
      
      if (stations.length === 0) {
        speak('No fuel stations found within 50 miles');
      } else {
        const cheapest = stations[0];
        speak(
          `Found ${stations.length} fuel stations. Cheapest is ${cheapest.name} at $${cheapest.price} per gallon`,
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to find fuel stations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('refresh') || lowerCommand.includes('search')) {
      refreshFuelPrices();
    } else if (lowerCommand.includes('cheapest')) {
      if (fuelStations.length > 0) {
        const cheapest = fuelStations[0];
        speak(
          `The cheapest fuel is at ${cheapest.name}, ${cheapest.address}, at $${cheapest.price} per gallon`,
        );
      }
    } else {
      speak('I can help you find the cheapest fuel. Say "search" or "cheapest".');
    }
  };

  const refreshFuelPrices = () => {
    if (currentLocation) {
      findCheapestFuel(currentLocation);
    } else {
      initializeLocation();
    }
  };

  const calculateSavings = (station: FuelStation) => {
    if (fuelStations.length < 2) return null;
    
    const mostExpensive = fuelStations[fuelStations.length - 1];
    const difference = mostExpensive.price - station.price;
    const gallons = 100; // Assume 100 gallon tank
    const savings = difference * gallons;
    
    return savings > 0 ? savings : null;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Finder</Text>
        <Text style={styles.subtitle}>
          Find the cheapest diesel prices
        </Text>
      </View>

      <VoiceButton
        onResult={handleVoiceCommand}
        prompt="What fuel information do you need?"
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Refresh Fuel Prices"
          onPress={refreshFuelPrices}
          loading={loading}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
        </View>
      )}

      {!loading && fuelStations.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No fuel stations found. Try refreshing.
          </Text>
        </View>
      )}

      {!loading && fuelStations.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {fuelStations.length} Fuel Stations (Sorted by Price)
          </Text>
          {fuelStations.map((station, index) => {
            const savings = calculateSavings(station);
            return (
              <View key={station.id} style={styles.stationCard}>
                {index === 0 && (
                  <View style={styles.cheapestBadge}>
                    <Text style={styles.cheapestText}>💰 CHEAPEST</Text>
                  </View>
                )}
                <View style={styles.stationHeader}>
                  <Text style={styles.stationName}>{station.name}</Text>
                  <Text style={styles.price}>${station.price.toFixed(2)}/gal</Text>
                </View>
                <Text style={styles.stationAddress}>{station.address}</Text>
                {station.distance !== undefined && (
                  <Text style={styles.distance}>
                    {station.distance.toFixed(1)} miles away
                  </Text>
                )}
                {savings && savings > 0 && (
                  <View style={styles.savingsContainer}>
                    <Text style={styles.savingsText}>
                      💵 Save ${savings.toFixed(2)} on 100 gallons vs highest price
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Fuel Finder Tips</Text>
        <Text style={styles.instructionsText}>
          • Prices sorted from lowest to highest{'\n'}
          • Say "cheapest" to hear the best price{'\n'}
          • Consider distance vs savings{'\n'}
          • Fuel prices are updated regularly{'\n'}
          {'\n'}
          <Text style={styles.note}>
            Note: In production, this would integrate with real-time fuel
            price APIs like GasBuddy for accurate pricing.
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
  stationCard: {
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
  cheapestBadge: {
    backgroundColor: '#27AE60',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  cheapestText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  stationAddress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  distance: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  savingsContainer: {
    backgroundColor: '#D5F4E6',
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
  },
  savingsText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: 'bold',
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

export default FuelFinderScreen;
