import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {MileageEntry} from '../types';
import {MileageService} from '../services/MileageService';
import {useVoice} from '../contexts/VoiceContext';
import VoiceButton from '../components/VoiceButton';
import Button from '../components/Button';

const MileageTrackerScreen: React.FC = () => {
  const [entries, setEntries] = useState<MileageEntry[]>([]);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [miles, setMiles] = useState('');
  const [paidMiles, setPaidMiles] = useState('');
  const [totals, setTotals] = useState({total: 0, paid: 0});
  const {speak} = useVoice();

  useEffect(() => {
    loadEntries();
    loadTotals();
  }, []);

  const loadEntries = async () => {
    const loadedEntries = await MileageService.getAllEntries();
    setEntries(loadedEntries);
  };

  const loadTotals = async () => {
    const totalsData = await MileageService.getTotalMiles();
    setTotals(totalsData);
  };

  const handleVoiceInput = (result: string) => {
    // Parse voice input for mileage entry
    // Example: "drove 250 miles from denver to kansas city, 230 paid"
    const milesMatch = result.match(/(\d+)\s*miles/i);
    const fromMatch = result.match(/from\s+([^to]+)to/i);
    const toMatch = result.match(/to\s+([^,]+)/i);
    const paidMatch = result.match(/(\d+)\s*paid/i);

    if (milesMatch) {
      setMiles(milesMatch[1]);
      if (fromMatch) setStartLocation(fromMatch[1].trim());
      if (toMatch) setEndLocation(toMatch[1].trim());
      if (paidMatch) setPaidMiles(paidMatch[1]);
      
      speak('Mileage information captured. Please review and save.');
    } else {
      speak('Could not understand mileage information. Please try again.');
    }
  };

  const saveEntry = async () => {
    if (!startLocation || !endLocation || !miles) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const milesNum = parseFloat(miles);
    const paidMilesNum = paidMiles ? parseFloat(paidMiles) : milesNum;

    try {
      await MileageService.saveMileageEntry({
        date: new Date().toISOString(),
        startLocation,
        endLocation,
        miles: milesNum,
        paidMiles: paidMilesNum,
      });

      speak(`Saved ${milesNum} miles from ${startLocation} to ${endLocation}`);
      
      // Clear form
      setStartLocation('');
      setEndLocation('');
      setMiles('');
      setPaidMiles('');

      // Reload data
      loadEntries();
      loadTotals();
    } catch (error) {
      Alert.alert('Error', 'Failed to save mileage entry');
      console.error(error);
    }
  };

  const deleteEntry = async (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await MileageService.deleteEntry(id);
            speak('Entry deleted');
            loadEntries();
            loadTotals();
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mileage Tracker</Text>
        <Text style={styles.subtitle}>
          Track your miles and paid miles
        </Text>
      </View>

      <View style={styles.totalsContainer}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Miles</Text>
          <Text style={styles.totalValue}>{totals.total.toFixed(1)}</Text>
        </View>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Paid Miles</Text>
          <Text style={styles.totalValue}>{totals.paid.toFixed(1)}</Text>
        </View>
      </View>

      <VoiceButton
        onResult={handleVoiceInput}
        prompt="Tell me about your trip. For example: drove 250 miles from Denver to Kansas City, 230 paid"
      />

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>New Entry</Text>
        
        <Text style={styles.label}>Start Location *</Text>
        <TextInput
          style={styles.input}
          value={startLocation}
          onChangeText={setStartLocation}
          placeholder="e.g., Denver, CO"
        />

        <Text style={styles.label}>End Location *</Text>
        <TextInput
          style={styles.input}
          value={endLocation}
          onChangeText={setEndLocation}
          placeholder="e.g., Kansas City, MO"
        />

        <Text style={styles.label}>Total Miles *</Text>
        <TextInput
          style={styles.input}
          value={miles}
          onChangeText={setMiles}
          placeholder="e.g., 250"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Paid Miles (optional)</Text>
        <TextInput
          style={styles.input}
          value={paidMiles}
          onChangeText={setPaidMiles}
          placeholder="e.g., 230"
          keyboardType="numeric"
        />

        <Button title="Save Entry" onPress={saveEntry} />
      </View>

      <View style={styles.entriesContainer}>
        <Text style={styles.entriesTitle}>Recent Entries</Text>
        {entries.length === 0 && (
          <Text style={styles.emptyText}>No entries yet</Text>
        )}
        {entries.map(entry => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>
              <Button
                title="Delete"
                onPress={() => deleteEntry(entry.id)}
                variant="danger"
                style={styles.deleteButton}
              />
            </View>
            <Text style={styles.entryRoute}>
              {entry.startLocation} → {entry.endLocation}
            </Text>
            <View style={styles.entryDetails}>
              <Text style={styles.entryMiles}>
                Total: {entry.miles} mi
              </Text>
              <Text style={styles.entryPaidMiles}>
                Paid: {entry.paidMiles} mi
              </Text>
            </View>
          </View>
        ))}
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
  totalsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  totalCard: {
    flex: 1,
    backgroundColor: '#3498DB',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  entriesContainer: {
    padding: 20,
  },
  entriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    padding: 20,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    minHeight: 30,
  },
  entryRoute: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  entryDetails: {
    flexDirection: 'row',
    gap: 20,
  },
  entryMiles: {
    fontSize: 14,
    color: '#3498DB',
  },
  entryPaidMiles: {
    fontSize: 14,
    color: '#27AE60',
  },
});

export default MileageTrackerScreen;
