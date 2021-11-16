import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import Colors from '../Constants/Colors';

const PasswordChange = ( { route }) => {

    const { email } = route.params;

    const [username, setUsername] = useState(email);
    const [newPassword, setNewPassword] = useState('');
    const [confCode, setConfCode] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation();

    // Auth.currentAuthenticatedUser()
    //     .then(user => navigation.navigate('DrawerNav'))
    //     .catch(err => console.log("error", err))


    const checkInput = () => {
        if (username.length > 0 && newPassword.length > 0 && confCode.length > 0) 
        setButtonDisabled(false)
    };

    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(username);
    };

    // const resetPassword = () => {
    //     // Send confirmation code to user's email
    //     Auth.forgotPassword(username)
    //         .then(data => {
    //             console.log(data);
    //             navigation.navigate('');
    //         })
    //         .catch(err => console.log(err));
    //         //display the error on screen
    // };

    // const passwordChange = () => {
    //     // Collect confirmation code and new password, then
    //     Auth.forgotPasswordSubmit(username, confCode, newPassword)
    //         .then(data => {
    //             console.log(data);
    //             navigation.navigate('Login', {email: username})
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             if (err.message.includes('not found')) {
    //                 setErrorMessage('User not found.')
    //             } else if (err.message.includes('Value at \'password\' failed')) {
    //                 setErrorMessage('Passwords must contain 8 or more characters.')
    //             } else if (err.message.includes('Invalid verification code')) {
    //                 setErrorMessage('Invalid verification code provided, please check and try again.')
    //             } else if (err.message.includes('Attempt limit exceeded')) {
    //                 setErrorMessage('Attempt limit axceeded, please try again later.')
    //             } else {
    //             setErrorMessage(err.message);
    //             }
    //         }
    //         )}


    const onSubmitEditing = () => {
        if (buttonDisabled === false) {
            if (validateEmail()) {
                passwordChange();
            } else {
                setErrorMessage('Please enter a valid email address');
            }
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
            <Text style={styles.textHeader}>New Password</Text>
            {errorMessage.length > 0 ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <View style={styles.textInputContainer}>
                <Image source={require('../images/emailIcon.png')} style={styles.icon} />
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
                <Image source={require('../images/passwordIcon.png')} style={styles.icon} />
                <TextInput 
                    style={styles.textInput} 
                    value={confCode}
                    autoCapitalize="none"
                    placeholder='Verification Code'
                    autoCorrect={false}
                    placeholderTextColor={Colors.primary}
                    onChangeText={text => {setConfCode(text); checkInput()}}
                    onSubmitEditing={onSubmitEditing} 
                />
            </View>
            <View style={styles.textInputContainer}>
                <Image source={require('../images/passwordIcon.png')} style={styles.icon} />
                <TextInput 
                    style={styles.textInput} 
                    value={newPassword}
                    autoCapitalize="none"
                    placeholder='New Password'
                    autoCorrect={false}
                    placeholderTextColor={Colors.primary}
                    onChangeText={text => {setNewPassword(text); checkInput()}}
                    onSubmitEditing={onSubmitEditing} 
                />
            </View>
            <TouchableOpacity onPress={onSubmitEditing} disabled={buttonDisabled} style={styles.button}>
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
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
        color: Colors.tabBarLight,
        fontSize: 36,
        textAlign: 'center'
    },
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 60,
        width: '75%',
        backgroundColor: Colors.tabBarLight,
        borderColor: Colors.primary,
        borderWidth: 4,
        borderRadius: 35,
        marginTop: 20
    },
    icon: {
        height: 25,
        width: 25,
        marginRight: 20,
        marginLeft: 20,
        resizeMode: 'contain',
        overflow: 'visible',
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
        borderColor: Colors.tabBarLight,
        borderWidth: 4,
        borderRadius: 35,
        marginTop: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: Colors.tabBarLight,
        fontSize: 25,
        fontWeight: 'bold'
    },
    error: {
        textAlign: 'center',
        color: Colors.tabBarLight,
        marginTop: 15,
        fontSize: 20,
        width: '75%'
    }
})

export default PasswordChange;