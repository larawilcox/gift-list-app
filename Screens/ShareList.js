import React from 'react';
import { Text, View, SafeAreaView, KeyboardAvoidingView, StyleSheet } from 'react-native';

import Colors from '../Constants/Colors';


const ShareList = () => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.KAVContainer}>
                <View>
                    <Text>Share List with....</Text>
                </View>
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
        alignItems: 'center',
    },
    KAVContainer: {
        flex: 1,
        alignItems: 'center'
    },
})

export default ShareList;