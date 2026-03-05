import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import TruckStopsScreen from './src/screens/TruckStopsScreen';
import NavigationScreen from './src/screens/NavigationScreen';
import MileageTrackerScreen from './src/screens/MileageTrackerScreen';
import FuelFinderScreen from './src/screens/FuelFinderScreen';
import NotesScreen from './src/screens/NotesScreen';
import EmailScreen from './src/screens/EmailScreen';
import {VoiceProvider} from './src/contexts/VoiceContext';

const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <VoiceProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2C3E50',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{title: 'Robby - Truck Assistant'}}
            />
            <Stack.Screen
              name="TruckStops"
              component={TruckStopsScreen}
              options={{title: 'Truck Stops'}}
            />
            <Stack.Screen
              name="Navigation"
              component={NavigationScreen}
              options={{title: 'Navigation'}}
            />
            <Stack.Screen
              name="MileageTracker"
              component={MileageTrackerScreen}
              options={{title: 'Mileage Tracker'}}
            />
            <Stack.Screen
              name="FuelFinder"
              component={FuelFinderScreen}
              options={{title: 'Fuel Finder'}}
            />
            <Stack.Screen
              name="Notes"
              component={NotesScreen}
              options={{title: 'Voice Notes'}}
            />
            <Stack.Screen
              name="Email"
              component={EmailScreen}
              options={{title: 'Send Email'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </VoiceProvider>
    </SafeAreaProvider>
  );
}

export default App;
