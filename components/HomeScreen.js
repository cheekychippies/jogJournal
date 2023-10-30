import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();

    const goToRunHistory = () => {
        navigation.navigate('History');
    };

    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', fontSize: 18 }}>
                Welcome to Jog Journal!
            </Text>
            <Button
                title="Start Run"
                onPress={() => navigation.navigate('StartRun')}
            />
            <Button
                title="Run History"
                onPress={goToRunHistory}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});

export default HomeScreen;
