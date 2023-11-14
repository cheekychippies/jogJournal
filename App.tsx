import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import StartRunScreen from './components/StartRunScreen';
import HistoryScreen from './components/HistoryScreen';
import MapScreen from './components/MapScreen';
import Login from './screens/Login';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './Firebase';


const Stack = createStackNavigator();

const InsideStack = createStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Home" component={HomeScreen} />
      <InsideStack.Screen name="StartRun" component={StartRunScreen} />
      <InsideStack.Screen name="History" component={HistoryScreen} />
      <InsideStack.Screen name="Map" component={MapScreen} />
    </InsideStack.Navigator>
  )
}

const App = () => {
  const [user, setUser] = useState < User | null > (null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    })
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
