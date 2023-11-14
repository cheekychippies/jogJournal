import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/app';
import 'firebase/auth';

const EXPO_PUBLIC_firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
};

const firebaseApp = initializeApp(EXPO_PUBLIC_firebaseConfig);
const auth = getAuth(firebaseApp);

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                if (!firebase.apps.length) {
                    await firebase.initializeApp(EXPO_PUBLIC_firebaseConfig);
                }
            } catch (error) {
                console.error('Firebase initialization error', error);
            }
        };

        initializeFirebase();

        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                navigation.navigate('Home');
            }
        });

        return () => unsubscribe();
    }, [navigation]);

    const handleSignIn = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <View>
            <Text>Email:</Text>
            <TextInput value={email} onChangeText={setEmail} />

            <Text>Password:</Text>
            <TextInput secureTextEntry value={password} onChangeText={setPassword} />

            <Button title="Sign In" onPress={handleSignIn} />
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
});

export default Login;


