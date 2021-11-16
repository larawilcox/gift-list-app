import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';
import { MaterialIcons } from '@expo/vector-icons'; 

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

    // async function signIn() {
    //     try {
    //         const user = await Auth.signIn(username, password);
    //         setErrorMessage('');
    //         navigation.navigate('DrawerNav', { username: username });
    //     } catch (error) {
    //         console.log('error signing in', error);
    //         setErrorMessage('Incorrect username or password');
    //     }
    // };

    const onSubmitEditing = () => {
        if (buttonDisabled === false) {
            if (validateEmail()) {
                login()
                console.log('signed in')
            } else {
                setErrorMessage('Please enter a valid email address');
            }
        }
    };

    const onForgotPassword = () => {
        navigation.navigate('ForgotPassword', {email: username});
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
            <Text style={styles.textHeader}>login</Text>
            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => {navigation.navigate('SignUp')}}>
                <Text style={styles.forgotPassword}>Sign Up</Text>
            </TouchableOpacity>
            {errorMessage.length > 0 ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={onForgotPassword}>
                <Text style={styles.forgotPassword}>Forgotten your password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmitEditing} disabled={buttonDisabled} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
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
        color: Colors.textLight,
        fontSize: 25,
        fontWeight: 'bold'
    },
    error: {
        textAlign: 'center',
        color: Colors.textError,
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

export default Login;