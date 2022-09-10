import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';
 

const Login = () => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation();

    const login = async () => {

        try {
            const login = await axios.post(`${BASE_URL}/users/login`, {
                "email": username,
                "password": password
            })
            await SecureStore.setItemAsync('token', login.data.token);
            await AsyncStorage.setItem('userId', login.data.user._id);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });

        } catch (e) {
            console.log(e)
            setErrorMessage('Please enter a valid username and password.')
        }
    }


    const checkInput = () => {
        if (username.length > 0 && password.length > 0)
        setButtonDisabled(false)
    };

    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(username);
    };

    useEffect(() => {
        const checkToken = async () => {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  });
            }
            // await SecureStore.setItemAsync('token', '');
        }
        void checkToken();
    }, [])


    const onSubmitEditing = () => {
        if (password.length > 6 && username.length > 0) {
            if (validateEmail()) {
                login()
                console.log('signed in')
            } else {
                setErrorMessage('Please enter a valid email address');
            }
        } else if (password.length < 7 && username.length > 0) {
            setErrorMessage('Please enter a password of at least 7 characters')
        } else if (username.length === 0) {
            setErrorMessage('Please enter a valid username')
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar  barStyle="light-content" translucent={true} backgroundColor={Colors.primary} />
            <KeyboardAvoidingView style={styles.KAVContainer}>
                <View style={styles.header}></View>
                <ScrollView
                        style={styles.inputContainer}
                        contentContainerStyle={styles.inputContentContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps='always'>
                    <View style={styles.input}>
                        <TouchableOpacity style={styles.signupContainer} onPress={() => {navigation.navigate('Sign Up')}}>
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                        {errorMessage.length > 0 ? <Text style={styles.error}>{errorMessage}</Text> : null}
                            <View style={styles.inputDetails}>
                                <Text style={styles.headerText}>Username</Text>
                                <TextInput
                                    style={styles.textInput} 
                                    value={username} 
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                    autoCapitalize="none" 
                                    onChangeText={text => {setUsername(text)}}
                                    //onSubmitEditing={onSubmitEditing}
                                />
                                <Text style={styles.headerText}>Password</Text>
                                <TextInput
                                    style={styles.textInput} 
                                    value={password}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={text => {setPassword(text)}}
                                    //onSubmitEditing={onSubmitEditing} 
                                    secureTextEntry={true}
                                />
                                <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => {navigation.navigate('Reset Password', {email: username})}}>
                                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>
                    </View>
                    
                    <TouchableOpacity style={styles.button} onPress={onSubmitEditing}>
                        <Text style={styles.newListText}>Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}


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
        width: '100%'
    },
    input: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupContainer: {
        width: '75%',
        alignItems: 'center',
        paddingBottom: 10
    },
    signUpText: {
        fontSize: 16,
        color: Colors.textLight,
        width: '75%',
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    forgotPasswordContainer: {
        width: '100%',
        alignItems: 'flex-start',
        paddingBottom: 10,
        paddingTop: 5
    },
    forgotPassword: {
        fontSize: 16,
        color: Colors.textDark,
        width: '100%',
        textAlign: 'left',
        paddingLeft: 20,
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
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 250
    },
    disabledButton: {
        height: 50,
        backgroundColor: Colors.disabledButton,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 250
    },
    newListText:{
        color: Colors.textLight,
        fontSize: 18,
        fontWeight: 'bold'
    },    
})

export default Login;