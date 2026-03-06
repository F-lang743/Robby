import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import Tts from 'react-native-tts';

interface VoiceContextType {
  isListening: boolean;
  result: string;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  speak: (text: string) => Promise<void>;
  error: string | null;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsListening(true);
      setError(null);
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setResult(e.value[0]);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setError(e.error?.message || 'Speech recognition error');
      setIsListening(false);
    };

    // Initialize TTS
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setResult('');
      await Voice.start('en-US');
    } catch (e) {
      setError('Failed to start voice recognition');
      console.error(e);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      await Tts.speak(text);
    } catch (e) {
      console.error('TTS error:', e);
    }
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        result,
        startListening,
        stopListening,
        speak,
        error,
      }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
};
