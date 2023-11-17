import { View, Text, TextInput, Image, StyleSheet, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import React, { useState} from 'react';
import { FIREBASE_AUTH } from "../Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";



const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const responce = await signInWithEmailAndPassword(auth, email, password);
            console.log(responce);
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false)
        }
    }
    const signUp = async () => {
        setLoading(true);
        try {
            const responce = await createUserWithEmailAndPassword(auth, email, password);
            console.log(responce);
            alert('Check your email')
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <Image source={require('../Image/JjLogo.png')} style={styles.image} />
                <Text style={styles.text}>
                    Welcome to Jog Journal
                </Text>
                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}></TextInput>
                {loading ? (
                    <ActivityIndicator size="large" color="white" />) : (<>
                        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={signIn}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.createAccountButton]} onPress={signUp}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </>)}
            </KeyboardAvoidingView>
        </View>
    )
}
export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#111111'
    },
    image: {
        alignSelf: 'center',
        width: 320,
        height: 250,
        borderRadius: 50,
        overflow: 'hidden',
        paddingBottom: 40
    },
    text: {
        textAlign: 'center',
        fontFamily: '',
        fontSize: 25,
        paddingBottom: 30,
        paddingTop: 30,
        color: '#ffffff'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'

    },
    button: {
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    loginButton: {
        backgroundColor: '#3498db',
    },
    createAccountButton: {
        backgroundColor: '#2ecc71',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});