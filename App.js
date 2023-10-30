import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen'; 
import StartRunScreen from './components/StartRunScreen'; 
import HistoryScreen from './components/HistoryScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StartRun" component={StartRunScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
