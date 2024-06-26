import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@rneui/themed';
import { useState } from 'react';

const MapScreen = ({ route }) => {
    const { routeData } = route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Header
                    leftComponent={{ text: 'History', style: { color: '#fff' }, onPress: () => navigation.navigate('History') }}
                    centerComponent={{ text: 'ROUTE', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff', onPress: () => navigation.navigate('Home') }}
                    containerStyle={{ backgroundColor: '#111111' }}
                />
            ),
        });
    }, [navigation]);


    const onMapReady = () => {
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {loading && (
                <ActivityIndicator
                    style={styles.activityIndicator}
                    size="large"
                    color="#fff"
                />
            )}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: routeData.route[0].latitude,
                    longitude: routeData.route[0].longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onMapReady={onMapReady}
            >
                {routeData.route.length > 1 && (
                    <Polyline
                        coordinates={routeData.route}
                        strokeWidth={4}
                        strokeColor="#00f"
                    />
                )}
            </MapView>

            <Text style={styles.runText}>
                Time Elapsed: {routeData.time}
            </Text>
            <Text style={styles.runText}>
                Total Distance: {routeData.distance.toFixed(2)} km
            </Text>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111111'
    },
    map: {
        flex: 1,
    },
    runText: {
        textAlign: 'center',
        fontSize: 20,
        paddingBottom: 10,
        paddingTop: 10,
        color: '#ffffff'
    },
    activityIndicator: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MapScreen;
