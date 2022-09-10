import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


import { BASE_URL } from '../Constants/Api';
import Colors from '../Constants/Colors';

const ResetPassword = ( { route }) => {

    const { email } = route.params;

    const [username, setUsername] = useState(email);
    const [errorMessage, setErrorMessage] = useState('');
    const [resetModalVisible, setResetModalVisible] = useState(false);

    const navigation = useNavigation();

    const reset = async () => {
        try {
            const resetPassword = await axios.post(`${BASE_URL}/resetpassword`, {
                "email": username,
            })
            setResetModalVisible(true); 
            
        } catch (e) {
            console.log(e)
            setErrorMessage('User not found')
        }
    }


    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(username);
    };

    const onSubmitEditing = () => {
        // console.log('email', email, username)
        if (validateEmail()) {
            //post user to resetcodes data collection
            reset();
       
        } else {
            setErrorMessage('Please enter a valid email address');
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
                            <View style={styles.inputDetails}>
                                {errorMessage.length > 0 ? <Text style={styles.error}>{errorMessage}</Text> : null}
                                <Text style={styles.headerText}>Username</Text>
                                <TextInput
                                    style={styles.textInput} 
                                    value={username} 
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                    autoCapitalize="none" 
                                    onChangeText={text => {setUsername(text)}}
                                />
                            </View>
                    </View>
                    
                    <TouchableOpacity style={styles.button} onPress={onSubmitEditing}>
                        <Text style={styles.buttonText}>Reset password</Text>
                    </TouchableOpacity>

                    <Modal visible={resetModalVisible} transparent={true}>
                        <View style={styles.contentContainer}>
                            <View style={styles.modalInputContainer}>
                                <Text style={styles.text}>An email to reset your password has been sent to {username}</Text>
                                <TouchableOpacity onPress={() => {setResetModalVisible(false); navigation.reset({index: 0, routes: [{ name: 'Login' }]})}} style={styles.button}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

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
        width: '100%'
    },
    input: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
    buttonText:{
        color: Colors.textLight,
        fontSize: 18,
        fontWeight: 'bold'
    }, 
    contentContainer: {
        backgroundColor: '#00000080',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    modalInputContainer: {
        paddingLeft: 5,
        width: '95%',
        height: 380,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
        marginTop: 100
    },  
    text: {
        fontSize: 22,
        color: Colors.primary,
        textAlign: 'center',
        width: 310,
        paddingBottom: 50,
        paddingTop: 10,
        fontWeight: 'bold'
    },
    
})

export default ResetPassword;