import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {

  ref(database, 'routes/')

  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  let subscription = null;

  const saveRoute = () => {
    push(ref(database, 'routes/'), route);
  }

  const startTracking = () => {
    setIsTracking(true);
    setRoute([]);

    if (subscription) {
      subscription.remove();
    }

    startLocationTracking();
  };

  const stopTracking = () => {
    setIsTracking(false);

    if (subscription) {
      subscription.remove();
      subscription = null;
    }
  };

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    subscription = Location.watchPositionAsync(
      { distanceInterval: 10 },
      (newLocation) => {
        setLocation(newLocation.coords);
        if (isTracking) {
          setRoute((prevRoute) => [...prevRoute, newLocation.coords]);
        }
      }
    );
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      // Start tracking if needed
      if (isTracking) {
        startLocationTracking();
      }
    };

    getLocation();
  }, [isTracking]);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          showsUserLocation
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {route.length > 1 && (
            <Polyline
              coordinates={route}
              strokeWidth={4}
              strokeColor="#00f"
            />
          )}
        </MapView>
      )}
      <Button
        title={isTracking ? 'Stop Tracking' : 'Start Tracking'}
        onPress={isTracking ? stopTracking : startTracking}
        color={isTracking ? 'red' : 'green'}
      />
      <Button
        title={'Save run'}
        onPress={saveRoute}
      />
      <Text style={{ textAlign: 'center', marginTop: 10 }}>
        {isTracking ? 'Tracking is active' : 'Tracking is not active'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
});
