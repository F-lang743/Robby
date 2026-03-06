import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-voice/voice', () => ({
  default: {
    start: jest.fn(),
    stop: jest.fn(),
    cancel: jest.fn(),
    destroy: jest.fn(),
    removeAllListeners: jest.fn(),
    isAvailable: jest.fn(() => Promise.resolve(true)),
    onSpeechStart: jest.fn(),
    onSpeechEnd: jest.fn(),
    onSpeechResults: jest.fn(),
    onSpeechError: jest.fn(),
  },
}));

jest.mock('react-native-tts', () => ({
  default: {
    speak: jest.fn(),
    stop: jest.fn(),
    setDefaultLanguage: jest.fn(),
    setDefaultRate: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  requestAuthorization: jest.fn(() => Promise.resolve('granted')),
}));

jest.mock('react-native-maps', () => {
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
    Polyline: View,
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
  },
}));
