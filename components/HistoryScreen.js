import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, remove, update } from 'firebase/database';
import { FIREBASE_AUTH, database } from '../Firebase'; // Import FIREBASE_AUTH and database from your Firebase module
import Modal from 'react-native-modal';

const HistoryScreen = () => {
    const [routeData, setRouteData] = useState([]);
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [newRouteName, setNewRouteName] = useState('');
    const [selectedRoute, setSelectedRoute] = useState(null);

    // Get the current user UID
    const userUid = FIREBASE_AUTH.currentUser?.uid;
    const routesRef = userUid ? ref(database, `users/${userUid}/routes`) : null;

    useEffect(() => {
        if (!routesRef) {
            return;
        }

        // Listen for changes in the user's routes
        const unsubscribe = onValue(routesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const routesArray = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
                setRouteData(routesArray);
            }
        });

        // Cleanup listener when unmounting
        return () => {
            unsubscribe();
        };
    }, [routesRef]);

    const deleteRun = (key) => {
        console.log('deleteRun', key);
        remove(ref(database, `users/${userUid}/routes/${key}`));
        closeModal();
    };

    const openModal = (route) => {
        setSelectedRoute(route);
        setNewRouteName(route.name);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const editRun = () => {
        if (selectedRoute) {
            // Update the routeName in the Firebase database
            update(ref(database, `users/${userUid}/routes/${selectedRoute.key}`), { name: newRouteName });
            closeModal();
        }
    };

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
                        onPress={() => navigation.navigate('Map', { routeData: route })}
                        style={styles.listcontainer}
                    >
                        <Text>{route.name} {route.startDate}</Text>
                        <Button onPress={() => openModal(route)} title="Edit" />
                    </TouchableOpacity>
                )}
                data={routeData}
                ItemSeparatorComponent={listSeparator}
            />
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer}>
                    <Text>Edit Route Name:</Text>
                    <TextInput
                        value={newRouteName}
                        onChangeText={(text) => setNewRouteName(text)}
                    />
                    <View style={styles.buttonContainer}>
                        <Button onPress={editRun} title="Update" />
                        <Button onPress={closeModal} title="Cancel" />
                        <Button title="Delete" onPress={() => deleteRun(selectedRoute.key)} />
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    }
});

export default HistoryScreen;
