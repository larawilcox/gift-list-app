import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';


const Settings = () => {
    const navigation = useNavigation();

    const [forename, setForename] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [buttonText, setButtonText] = useState('Save Changes');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (forename.length > 0 && surname.length > 0 && email.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [forename, surname, email]);

    const fetchUserDetails = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const userDetails = await axios.get(`${BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(userDetails.data);
            console.log(token)
            setForename(userDetails.data.forename);
            setSurname(userDetails.data.surname);
            setEmail(userDetails.data.email);
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        void fetchUserDetails();
    }, []);

    const validateEmail = () => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const saveChanges = async () => {
        if (validateEmail()) {
            try {
                const token = await SecureStore.getItemAsync('token')
                const editDetails = await axios.patch(`${BASE_URL}/users/me`, {
                    forename,
                    surname,
                    email
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setErrorMessage('');
                console.log(editDetails.data);

            
            } catch (e) {
                console.log(e);
            }
        } else {
            setErrorMessage('Please enter a valid email address.')
        }
    }

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

    const deleteAccount = async () => {
        try {
            const token = await SecureStore.getItemAsync('token')
            const deleteUser = await axios.delete(`${BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token} `
                }
            })
            await SecureStore.deleteItemAsync('token')
            setModalVisible(false)
            navigation.navigate('Sign Up')
        } catch (e) {
            console.log(e)
        }
    }

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
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType='email-address'
                                // onSubmitEditing={move focus to date input}
                            />
                            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.newListButton} disabled={buttonDisabled} onPress={saveChanges}>
                        <Text style={styles.newListText}>{buttonText}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.newListButton} onPress={logout}>
                        <Text style={styles.newListText}>Logout</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.newListButton} onPress={() => {setModalVisible(true)}}>
                        <Text style={styles.newListText}>Delete my Account</Text>
                    </TouchableOpacity>

                    <Modal
                        visible={modalVisible}
                        transparent={true}
                    >
                        <View style={styles.contentContainer}>
                            <View style={styles.modalInputContainer}>
                                <Text style={styles.text}>Are you sure you want to delete your account?</Text>
                                <Text style={styles.text}>This will remove all your lists and your friends' access to your lists.</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={deleteAccount}>
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {setModalVisible(false)}} style={styles.button}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
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
        width: '100%'
    },
    header: {
        height: 80,
        width: '100%',
        backgroundColor: Colors.primary,
        color: 'black'
    },
    input: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
    listInput: {
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
    newListButton:{
        height: 50,
        backgroundColor: Colors.primary,
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
    inputContainer: {
        //marginLeft: '5%',
        width: '100%',
        position: 'absolute',
        zIndex: 100,
        marginTop: 45,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
        //paddingBottom: 150
    },
    inputContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        //paddingLeft: '5%',
        width: '100%'
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
    KAVContainer: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        //justifyContent: 'center',
        width: '100%'
    },
    error: {
        textAlign: 'center',
        color: Colors.textError,
        marginTop: 15,
        fontSize: 20
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
        paddingTop: 50,
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
        paddingBottom: 10,
        paddingTop: 10,
        fontWeight: 'bold'
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    button:{
        height: 60,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 135,
        marginTop: 50,
    },
    buttonText:{
        color: Colors.textLight,
        fontSize: 18,
        fontWeight: 'bold'
    },
})


export default Settings;