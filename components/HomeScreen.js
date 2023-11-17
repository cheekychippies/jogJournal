import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../Firebase';
import { Header } from '@rneui/themed';

const HomeScreen = () => {
    const navigation = useNavigation();

    const goToRunHistory = () => {
        navigation.navigate('History');
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Header
                    centerComponent={{ text: 'EXPLORE', style: { color: '#fff' } }}
                    rightComponent={
                        <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()}>
                            <Text style={{ color: '#fff', marginRight: 10 }}>Log out</Text>
                        </TouchableOpacity>
                    }
                    containerStyle={{ backgroundColor: '#111111' }}
                />
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>What Do You Want To Do?</Text>
            <Image
                source={require('../Image/Run2.png')}
                style={styles.image}
            />

            <TouchableOpacity
                style={[styles.button, styles.runButton]}
                onPress={() => navigation.navigate('StartRun')}
            >
                <Text style={styles.buttonText}>Start Run</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={goToRunHistory}>
                <Text style={styles.buttonText}>Show History</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#111111',
    },
    text: {
        textAlign: 'center',
        fontFamily: '',
        fontSize: 25,
        paddingBottom: 20,
        paddingTop: 20,
        color: '#ffffff',
    },
    image: {
        alignSelf: 'center',
        width: 320,
        height: 325,
        borderRadius: 50,
        overflow: 'hidden',
        marginBottom: 20,
    },
    button: {
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: '#3498db',
    },
    runButton: {
        backgroundColor: '#00adb5',
    },
    historyButton: {
        backgroundColor: ''
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default HomeScreen;
