import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen'; 
import StartRunScreen from './components/StartRunScreen'; 
import HistoryScreen from './components/HistoryScreen';
import MapScreen from './components/MapScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StartRun" component={StartRunScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Map" component={MapScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
