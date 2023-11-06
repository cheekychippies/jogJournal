import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

const MapScreen = ({ route }) => {
    const { routeData } = route.params;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: routeData.route[0].latitude,
                    longitude: routeData.route[0].longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {routeData.route.length > 1 && (
                    <Polyline
                        coordinates={routeData.route}
                        strokeWidth={4}
                        strokeColor="#00f"
                    />
                )}
            </MapView>

            <Text style={{ textAlign: 'center', marginTop: 10 }}>
                Time Elapsed: {routeData.time}
            </Text>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
                Total Distance: {routeData.distance.toFixed(2)} km
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

export default MapScreen;
