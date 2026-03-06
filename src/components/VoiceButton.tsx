import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useVoice} from '../contexts/VoiceContext';

interface VoiceButtonProps {
  onResult?: (result: string) => void;
  prompt?: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({onResult, prompt}) => {
  const {isListening, result, startListening, stopListening, speak, error} =
    useVoice();

  React.useEffect(() => {
    if (result && onResult) {
      onResult(result);
    }
  }, [result, onResult]);

  const handlePress = async () => {
    if (isListening) {
      await stopListening();
    } else {
      if (prompt) {
        await speak(prompt);
        // Wait a bit for TTS to finish
        setTimeout(() => {
          startListening();
        }, 500);
      } else {
        await startListening();
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isListening && styles.listeningButton]}
        onPress={handlePress}>
        <Text style={styles.icon}>{isListening ? '🎤' : '🎙️'}</Text>
        <Text style={styles.text}>
          {isListening ? 'Listening...' : 'Tap to Speak'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      {result && <Text style={styles.result}>"{result}"</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#3498DB',
    borderRadius: 60,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  listeningButton: {
    backgroundColor: '#E74C3C',
  },
  icon: {
    fontSize: 40,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  error: {
    color: '#E74C3C',
    marginTop: 10,
    fontSize: 14,
  },
  result: {
    color: '#2C3E50',
    marginTop: 10,
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default VoiceButton;
