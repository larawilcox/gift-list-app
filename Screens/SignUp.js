import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';


const SignUp = () => {

    const [forename, setForename] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation();

    const signup = async () => {

        try {
            const signup = await axios.post(`${BASE_URL}/users`, {
                "forename": forename,
                "surname": surname,
                "email": username,
                "password": password
            })
            await SecureStore.setItemAsync('token', signup.data.token);
            await AsyncStorage.setItem('userId', login.data.user._id);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });

        } catch (e) {
            console.log(e)
        }
    }


    const checkInput = () => {
        if (username.length > 0 && password.length > 0 && forename.length > 0 && surname.length > 0)
        setButtonDisabled(false)
    };

    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(username);
    };


    const onSubmitEditing = () => {
        if (buttonDisabled === false) {
            if (validateEmail()) {
                signup()
            } else {
                setErrorMessage('Please enter a valid email address');
            }
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
            <Text style={styles.textHeader}>Sign Up</Text>
            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => {navigation.navigate('Login')}}>
                <Text style={styles.forgotPassword}>Login</Text>
            </TouchableOpacity>
            {errorMessage.length > 0 ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <View style={styles.textInputContainer}>
                <Ionicons name="person" size={24} color={Colors.primary} style={styles.icon} />
                <TextInput 
                    style={styles.textInput} 
                    value={forename}
                    autoCapitalize="words"
                    placeholder='Forename'
                    autoCorrect={false}
                    placeholderTextColor={Colors.primary}
                    onChangeText={text => {setForename(text); checkInput()}}
                    onSubmitEditing={onSubmitEditing} 
                />
            </View>
            <View style={styles.textInputContainer}>
                <Ionicons name="person" size={24} color={Colors.primary} style={styles.icon} />
                <TextInput 
                    style={styles.textInput} 
                    value={surname}
                    autoCapitalize="words"
                    placeholder='Surname'
                    autoCorrect={false}
                    placeholderTextColor={Colors.primary}
                    onChangeText={text => {setSurname(text); checkInput()}}
                    onSubmitEditing={onSubmitEditing} 
                />
            </View>
            <View style={styles.textInputContainer}>
                <MaterialIcons name="email" size={28} color={Colors.primary} style={styles.icon} />
                <TextInput 
                    style={styles.textInput} 
                    value={username} 
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none" 
                    placeholder='E-mail'
                    placeholderTextColor={Colors.primary}
                    onChangeText={text => {setUsername(text); checkInput()}}
                    onSubmitEditing={onSubmitEditing}
                />
            </View>
            <View style={styles.textInputContainer}>
                <MaterialIcons name="lock" size={28} color={Colors.primary} style={styles.icon} />
                <TextInput 
                    style={styles.textInput} 
                    value={password}
                    autoCapitalize="none"
                    placeholder='Password'
                    autoCorrect={false}
                    placeholderTextColor={Colors.primary}
                    onChangeText={text => {setPassword(text); checkInput()}}
                    onSubmitEditing={onSubmitEditing} 
                />
            </View>
            <TouchableOpacity onPress={onSubmitEditing} disabled={buttonDisabled} style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        width: '100%'
    },
    logoImage: {
        height: '15%',
        aspectRatio: 1,
        resizeMode: 'contain',
        overflow: 'visible',
        marginBottom: 25,
        marginTop: '10%'
    },
    textHeader: {
        color: Colors.primary,
        fontSize: 36,
        textAlign: 'center'
    },
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 60,
        width: '75%',
        backgroundColor: Colors.background,
        borderColor: Colors.primary,
        borderWidth: 4,
        borderRadius: 35,
        marginTop: 20
    },
    icon: {
        marginRight: 20,
        marginLeft: 20,
    },
    textInput: {
        color: Colors.primary,
        fontSize: 20,
        width: '70%'
        
    },
    button: {
        width: '75%',
        height: 60,
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        borderWidth: 4,
        borderRadius: 35,
        marginTop: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 25,
        fontWeight: 'bold'
    },
    error: {
        textAlign: 'center',
        color: Colors.primary,
        marginTop: 15,
        fontSize: 20
    },
    forgotPassword: {
        fontSize: 16,
        color: Colors.primary,
        width: '75%',
        marginTop: 2,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    forgotPasswordContainer: {
        width: '75%',
        alignItems: 'center'
    }
})

export default SignUp;