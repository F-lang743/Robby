import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useVoice} from '../contexts/VoiceContext';
import VoiceButton from '../components/VoiceButton';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const {speak} = useVoice();

  useEffect(() => {
    // Welcome message
    speak('Welcome to Robby, your truck driving assistant. How can I help you today?');
  }, [speak]);

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('truck stop') || lowerCommand.includes('rest area')) {
      navigation.navigate('TruckStops' as never);
      speak('Opening truck stops finder');
    } else if (lowerCommand.includes('navigation') || lowerCommand.includes('navigate')) {
      navigation.navigate('Navigation' as never);
      speak('Opening navigation');
    } else if (lowerCommand.includes('mileage') || lowerCommand.includes('miles')) {
      navigation.navigate('MileageTracker' as never);
      speak('Opening mileage tracker');
    } else if (lowerCommand.includes('fuel') || lowerCommand.includes('gas')) {
      navigation.navigate('FuelFinder' as never);
      speak('Opening fuel finder');
    } else if (lowerCommand.includes('note')) {
      navigation.navigate('Notes' as never);
      speak('Opening voice notes');
    } else if (lowerCommand.includes('email') || lowerCommand.includes('mail')) {
      navigation.navigate('Email' as never);
      speak('Opening email');
    } else {
      speak('I did not understand that command. Please try again.');
    }
  };

  const features = [
    {
      title: '🛣️ Truck Stops',
      subtitle: 'Find nearby stops',
      screen: 'TruckStops',
      voiceCommand: 'truck stops',
    },
    {
      title: '🧭 Navigation',
      subtitle: 'Route guidance',
      screen: 'Navigation',
      voiceCommand: 'navigation',
    },
    {
      title: '📊 Mileage Tracker',
      subtitle: 'Track your miles',
      screen: 'MileageTracker',
      voiceCommand: 'mileage',
    },
    {
      title: '⛽ Fuel Finder',
      subtitle: 'Cheapest fuel prices',
      screen: 'FuelFinder',
      voiceCommand: 'fuel',
    },
    {
      title: '📝 Voice Notes',
      subtitle: 'Take notes by voice',
      screen: 'Notes',
      voiceCommand: 'notes',
    },
    {
      title: '✉️ Send Email',
      subtitle: 'Hands-free email',
      screen: 'Email',
      voiceCommand: 'email',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Robby Assistant</Text>
        <Text style={styles.subtitle}>
          Your hands-free driving companion
        </Text>
      </View>

      <VoiceButton
        onResult={handleVoiceCommand}
        prompt="What would you like to do?"
      />

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Features</Text>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => {
              navigation.navigate(feature.screen as never);
              speak(`Opening ${feature.title}`);
            }}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            <Text style={styles.voiceCommand}>
              Say: "{feature.voiceCommand}"
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Quick Guide</Text>
        <Text style={styles.instructionsText}>
          • Tap the microphone to activate voice commands{'\n'}
          • Say commands like "find truck stops" or "track mileage"{'\n'}
          • All features work hands-free for safety{'\n'}
          • Tap any feature card to access directly
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
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#BDC3C7',
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  voiceCommand: {
    fontSize: 12,
    color: '#3498DB',
    fontStyle: 'italic',
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
});

export default HomeScreen;
