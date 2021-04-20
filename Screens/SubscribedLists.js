import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native';

import Colors from '../Constants/Colors';

const SubscribedLists = () => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <Text style={styles.text}>Subscribed Lists</Text>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        color: Colors.textLight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center'
    }
})

export default SubscribedLists;