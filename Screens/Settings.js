import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';

import { userData } from '../Data/UserData';

const Settings = () => {
    const navigation = useNavigation();

    const [forename, setForename] = useState(userData.forename);
    const [surname, setSurname] = useState(userData.surname);
    const [email, setEmail] = useState(userData.email);

    const logout = async () => {
        
        try {
            const token = await SecureStore.getItemAsync('token')
            const logoutUser = await axios.post(`${BASE_URL}/users/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token} `
                }
            })
            await SecureStore.deleteItemAsync('token')
        navigation.navigate('Login')
        } catch (e) {
            console.log(e)
        }

    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <View style={styles.input}>
                    <Text style={styles.headerText}>First Name:</Text>
                    <TextInput
                        style={styles.listInput}
                        onChangeText={setForename}
                        value={forename}
                        autofocus={true}
                        // onSubmitEditing={move focus to date input}
                    />
                    <Text style={styles.headerText}>Last Name:</Text>
                    <TextInput
                        style={styles.listInput}
                        onChangeText={setSurname}
                        value={surname}
                        autofocus={true}
                        // onSubmitEditing={move focus to date input}
                    />
                    <Text style={styles.headerText}>Email:</Text>
                    <TextInput
                        style={styles.listInput}
                        onChangeText={setEmail}
                        value={email}
                        autofocus={true}
                        keyboardType='email-address'
                        // onSubmitEditing={move focus to date input}
                    />
                </View>
                <TouchableOpacity style={styles.newListButton} onPress={() => {}}>
                    <Text style={styles.newListText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.newListButton} onPress={logout}>
                    <Text style={styles.newListText}>Logout</Text>
                </TouchableOpacity>
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
    },
    input: {
        flex: 1
    },
    headerText: {
        fontSize: 18,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 10,
        paddingTop: 40
    },
    listInput: {
        minHeight: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        width: 300,
        paddingLeft: 20,
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left'
    },
    newListButton:{
        height: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 300
    },
    newListText:{
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
})


export default Settings;