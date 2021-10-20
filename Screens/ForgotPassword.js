import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import Colors from '../Constants/Colors';

const ForgotPassword = ( { route }) => {

    const { email } = route.params;

    const [username, setUsername] = useState(email);
    const [buttonDisabled, setButtonDisabled] = useState(email && email.length > 0 ? false : true);
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation();

    const checkInput = () => {
        if (username.length > 0)
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
    //             setErrorMessage('');
    //             navigation.navigate('PasswordChange', {email: username});
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             if (err.message.includes('not found')) {
    //                 setErrorMessage('User not found.')
    //             } else if (err.message.includes('burger')) {
    //                 setErrorMessage('burger')
    //             } else {
    //             setErrorMessage(err.message);
    //             }
    //         });
    // };


    const onSubmitEditing = () => {
        if (buttonDisabled === false) {
            if (validateEmail()) {
                //resetPassword();
                console.log('Password has been reset')
            } else {
                setErrorMessage('Please enter a valid email address');
            }
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
            <Text style={styles.textHeader}>Reset Password</Text>
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
        borderColor: Colors.secondary,
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
        backgroundColor: Colors.secondary,
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

export default ForgotPassword;