import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, remove, update } from 'firebase/database';
import { FIREBASE_AUTH, database } from '../Firebase'; // Import FIREBASE_AUTH and database from your Firebase module
import Modal from 'react-native-modal';
import { ListItem, Avatar } from '@rneui/themed';
import { Header } from '@rneui/themed';
import { Icon } from '@rneui/themed';

const HistoryScreen = () => {
    const [routeData, setRouteData] = useState([]);
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [newRouteName, setNewRouteName] = useState('');
    const [selectedRoute, setSelectedRoute] = useState(null);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Header
                    centerComponent={{ text: 'HISTORY', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff', onPress: () => navigation.navigate('Home'), }}
                    containerStyle={{ backgroundColor: '#111111' }}
                />
            ),
        });
    }, [navigation]);

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

    const renderItem = ({ item: route }) => (
        <ListItem bottomDivider onPress={() => navigation.navigate('Map', { routeData: route })}
            containerStyle={styles.listItemContainer}>
            <Avatar
                rounded
                source={{ uri: "https://sunriserunco.com/wp-content/uploads/2020/03/52-Motivational-Running-Quotes-to-Keep-You-Inspired-1200x600.jpg" }}
            />
            <ListItem.Content>
                <ListItem.Title style={styles.text}>{route.name}</ListItem.Title>
                <ListItem.Subtitle style={styles.subText}>{route.startDate}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon name='edit' color={'white'} onPress={() => openModal(route)} title="Edit" />
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                keyExtractor={(route, index) => route.key || index.toString()}
                renderItem={renderItem}
                data={routeData}
                ListEmptyComponent={() => (
                    <ActivityIndicator size="large" color="#ffffff" />
                )}
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
        backgroundColor: '#111111'
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
    },
    list: {
        width: '100%',
    },
    listItemContainer: {
        backgroundColor: '#111111',
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        color: '#ffffff'
    },
    subText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#ffffff'
    },

});

export default HistoryScreen;
