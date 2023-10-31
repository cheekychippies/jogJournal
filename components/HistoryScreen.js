import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from 'firebase/database';


const EXPO_PUBLIC_firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(EXPO_PUBLIC_firebaseConfig);
const database = getDatabase(app);

ref(database, 'routes/')

const HistoryScreen = () => {
    const [routeData, setRouteData] = useState([]);
    const navigation = useNavigation(); // Käytetään navigaatiota

    const routesRef = ref(database, 'routes');
    useEffect(() => {
        // Listen for changes in the routes data
        onValue(routesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Convert the data into an array, assuming it's structured as an object with unique IDs
                const routesArray = Object.values(data);
                setRouteData(routesArray);
            }
        });

        // Clean up the listener when the component unmounts
        return () => {
            // Stop listening to changes when the component unmounts
            // This is important to avoid memory leaks
            // For example: off(routesRef);
        };
    }, []);


    const listSeparator = () => {
        return (
            <View
                style={{
                    height: 5,
                    width: "80%",
                    backgroundColor: "#fff",
                    marginLeft: "10%"
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={{ marginLeft: "5%" }}
                keyExtractor={(route, index) => route.key || index.toString()}
                renderItem={({ item: route }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Map', { routeData: route })} // Siirretään data MapScreenille
                        style={styles.listcontainer}
                    >
                        <Text>{route.name} {route.startDate}</Text>
                        <Text></Text>
                    </TouchableOpacity>
                )}
                data={routeData}
                ItemSeparatorComponent={listSeparator}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listcontainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
});
export default HistoryScreen;