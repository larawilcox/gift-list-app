import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';



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
            await AsyncStorage.setItem('userId', signup.data.user._id);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });

        } catch (e) {
            console.log(e)
            if (e.response.data.message) {
                setErrorMessage('Your password cannot contain the word password')
            } else {
                setErrorMessage('An account with this email address already exists')
            }
            
        }
    }


    const checkInput = () => {
        if (username.length > 0 && password.length > 6 && forename.length > 0 && surname.length > 0) {
            setButtonDisabled(false);
            setErrorMessage('');
        } else {
            setButtonDisabled(true);
        }
    };

    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(username);
    };

    const validatePassword = () => {
        if (password.length < 7) {
            setErrorMessage('Your password must have at least 7 characters');
        }
    };

    const onSubmitEditing = () => {
        if (buttonDisabled === false) {
            if (validateEmail()) {
                signup();
            } else {
                setErrorMessage('Please enter a valid email address');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar  barStyle="light-content" translucent={true} backgroundColor={Colors.primary} />
            <KeyboardAvoidingView style={styles.KAVContainer} behavior='padding'>
                <View style={styles.header}></View>
                <ScrollView
                        style={styles.inputContainer}
                        contentContainerStyle={styles.inputContentContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps='always'>
                    <View style={styles.input}>
                        <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => {navigation.reset({
                            index: 0,
                            routes: [{ name: "Login" }]
                        })    }}>
                            <Text style={styles.forgotPassword}>Login</Text>
                        </TouchableOpacity>
                        {errorMessage.length > 0 ? <Text style={styles.error}>{errorMessage}</Text> : null}
                        <View style={styles.inputDetails}>
                            <Text style={styles.headerText}>Forename</Text>
                            <TextInput
                                style={styles.textInput} 
                                value={forename}
                                autoCapitalize="words"
                                autoCorrect={false}
                                onChangeText={text => {setForename(text); checkInput()}}
                                //onSubmitEditing={onSubmitEditing} 
                            />
                            <Text style={styles.headerText}>Surname</Text>
                            <TextInput
                                style={styles.textInput} 
                                value={surname}
                                autoCapitalize="words"
                                autoCorrect={false}
                                onChangeText={text => {setSurname(text); checkInput()}}
                                //onSubmitEditing={onSubmitEditing} 
                            />
                            <Text style={styles.headerText}>Email address</Text>
                            <TextInput
                                style={styles.textInput} 
                                value={username} 
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none" 
                                onChangeText={text => {setUsername(text); checkInput()}}
                                //onSubmitEditing={onSubmitEditing}
                            />
                            <Text style={styles.headerText}>Password</Text>
                                <TextInput
                                    style={styles.textInput} 
                                    value={password}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={text => {setPassword(text); checkInput()}}
                                    //onSubmitEditing={onSubmitEditing} 
                                    secureTextEntry={true}
                                    blurOnSubmit
                                    onBlur={validatePassword}
                                />
                        </View>
                    </View>
                    <TouchableOpacity onPress={onSubmitEditing} disabled={buttonDisabled} style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        width: '100%',
        color: Colors.textLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    KAVContainer: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        width: '100%'
    },
    header: {
        height: 80,
        width: '100%',
        backgroundColor: Colors.primary,
        color: 'black'
    },
    inputContainer: {
        width: '100%',
        position: 'absolute',
        zIndex: 100,
        marginTop: 25,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    inputContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingBottom: 220
    },
    input: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    forgotPasswordContainer: {
        width: '75%',
        alignItems: 'center',
        paddingBottom: 10
    },
    forgotPassword: {
        fontSize: 16,
        color: Colors.textLight,
        width: '75%',
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    error: {
        textAlign: 'center',
        color: Colors.textError,
        marginTop: 35,
        marginBottom: 15,
        fontSize: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    inputDetails: {
        width: '90%',
        backgroundColor: Colors.secondary,
        paddingBottom: 20,
        justifyContent: 'center',
        marginBottom: 20,
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
    },
    headerText: {
        fontSize: 18,
        color: Colors.textDark,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 5,
        paddingTop: 20,
        paddingLeft: 20
    },
    textInput: {
        minHeight: 50,
        borderRadius: 5,
        width: '90%',
        marginLeft: 20,
        paddingLeft: 10,
        fontSize: 18,
        color: Colors.textDark,
        backgroundColor: Colors.background,
        textAlign: 'left',
        justifyContent: 'center'
    },
    button: {
        height: 50,
        backgroundColor: Colors.primary,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 250
    },
    buttonText:{
        color: Colors.textLight,
        fontSize: 18,
        fontWeight: 'bold'
    }
})

export default SignUp;