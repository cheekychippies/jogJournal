import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from 'firebase/database';
import Modal from 'react-native-modal';

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

const StartRunScreen = () => {
    ref(database, 'routes/')

    const [location, setLocation] = useState(null);
    const [route, setRoute] = useState([]);
    const [isTracking, setIsTracking] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [routeName, setRouteName] = useState('');
    const [totalDistance, setTotalDistance] = useState(0);
    const [timer, setTimer] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [timerIntervalId, setTimerIntervalId] = useState(null);


    let subscription = null;

    function formatStartDate(date) {
        if (!date) return '';
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    }

    function calculateDistance(coord1, coord2) {
        const R = 6371; // Earth's radius in kilometers
        const lat1 = coord1.latitude;
        const lon1 = coord1.longitude;
        const lat2 = coord2.latitude;
        const lon2 = coord2.longitude;

        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in kilometers

        return distance;
    }



    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}:${minutes}:${remainingSeconds}`;
    }

    const saveRoute = () => {
        if (route.length === 0) {
            console.log('Route is empty. Nothing to save.');
            return;
        }

        toggleModal(); // Close the modal
        // Create an object
        const routeData = {
            name: routeName,
            route: route,
            distance: totalDistance,
            time: formatTime(timer),
            startDate: formatStartDate(startDate)
        };

        // Push the routeData to the database
        push(ref(database, 'routes/'), routeData);

        // Clear the routeName and route data
        setRouteName('');
        setRoute([]);
        setTimer(0);
    };


    const startTracking = () => {
        setIsTracking(true);
        setRoute([]);
        setStartDate(new Date());
        setTotalDistance(0); // Reset the distance
        setTimer(0); // Reset the timer


        if (subscription) {
            subscription.remove();
        }
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);

        startLocationTracking();
        setTimerIntervalId(intervalId);
    };

    const stopTracking = () => {
        setIsTracking(false);



        if (subscription) {
            subscription.remove();
            subscription = null;
        }
        clearInterval(timerIntervalId);
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

        
            if (isTracking) {
                startLocationTracking();
            }
        };

        getLocation();
    }, [isTracking]);
    useEffect(() => {
        let tempTotalDistance = 0;

        for (let i = 1; i < route.length; i++) {
            const coord1 = route[i - 1];
            const coord2 = route[i];
            tempTotalDistance += calculateDistance(coord1, coord2);
        }

        setTotalDistance(tempTotalDistance);
    }, [route]);

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
                onPress={toggleModal} // Open the modal when "Save run" is clicked
            />
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <TextInput
                        placeholder="Enter route name"
                        value={routeName}
                        onChangeText={(text) => setRouteName(text)}
                        style={styles.textInput}
                    />
                    <Button title="Save" onPress={saveRoute} />
                    <Button title="Cancel" onPress={toggleModal} />
                </View>
            </Modal>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
                Total Distance: {totalDistance.toFixed(2)} km
            </Text>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
                Time Elapsed: {formatTime(timer)}
            </Text>
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
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
});

export default StartRunScreen;