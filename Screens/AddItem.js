import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import isURL from 'validator/lib/isURL';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';

import { Ionicons } from '@expo/vector-icons';

const AddItem = ({ route }) => {

    const [itemDescription, setItemDescription] = useState('');
    const [itemDetail, setItemDetail] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [linkDescription, setLinkDescription] = useState('');
    const [link, setLink] = useState('');
    const [links, setLinks] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [linkError, setLinkError] = useState('');
    const [linkInputVisible, setLinkInputVisible] = useState(false);
    const [inputError, setInputError] = useState('');

    const priceValueOptions = [
        { label: 'Unspecified', value: '0' },
        { label: 'Under £10', value: '1' },
        { label: '£10-£20', value: '2' },
        { label: '£20-£50', value: '3' },
        { label: '£50-£100', value: '4' },
        { label: 'Over £100', value: '5' },
    ];

    const navigation = useNavigation();

    const { listId, listName } = route.params;
    let { data } = route.params;


    useEffect(() => {
        if (link.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [link]);

    useEffect(() => {
        if (itemDescription.length > 0) {
            setSaveButtonDisabled(false)
        } else {
            setSaveButtonDisabled(true)
        }
    }, [itemDescription]);

    useEffect(() => {
        if (!!itemPrice) {
            
            setInputError('')
            console.log(itemPrice)
        }
    }, [itemPrice])

    const updateLinks = e => {
        if (isURL(link)) {
            setLinks([
                ...links,
                {
                    linkDescription: linkDescription,
                    link: link
                }
            ]);
            setLinkDescription('');
            setLink('');
            setLinkError('');
            setLinkInputVisible(false);
    } else {
            setLinkError('This is not a valid URL')
    }};


    const addItemToList = async () => {
        if (itemDescription.length > 0 && itemPrice && itemPrice.length > 0) {
            try {
                const token = await SecureStore.getItemAsync('token')
                const addedItemToList = await axios.post(`${BASE_URL}/lists/${listId}`, {
                    item: itemDescription,
                    detail: itemDetail,
                    price: itemPrice,
                    links: links,
                    actions: {
                        personId: '',
                        action: ''
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setItemDescription('');
                setItemDetail('');
                setLinks([]);
                setItemPrice('');
                setInputError('');

                navigation.reset({
                    index: 0,
                    routes: [{ name: "Chosen List", params: {
                        listId,
                        listName
                    } }],

                })

            } catch (e) {
                console.log(e)
            }
        } else {
                setInputError('Please complete all required fields, marked with a *.')
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
                    // keyboardShouldPersistTaps='always'
                    >
                    <View style={styles.input}>
                        <View style={styles.inputDetails}>
                            <View style={styles.descriptionLineAsterisk}>
                                <Text style={styles.headerText}>Item Description</Text>
                                <Text style={styles.asterisk}>*</Text>
                            </View>
                            <TextInput
                                style={styles.listInput}
                                onChangeText={setItemDescription}
                                value={itemDescription}
                                multiline={true}
                                textAlignVertical='center'
                                autoCorrect={false}
                            />
                            <Text style={styles.headerText}>Item Detail</Text>
                            <TextInput
                                style={styles.listInput}
                                onChangeText={setItemDetail}
                                value={itemDetail}
                                multiline={true}
                                textAlignVertical='center'
                                autoCorrect={true}
                            />
                            <View style={styles.descriptionLineAsterisk}>
                                <Text style={styles.headerText}>Price Range</Text>
                                <Text style={styles.asterisk}>*</Text>
                            </View>
                            <View style={styles.listInput}>
                                <RNPickerSelect
                                    onValueChange={setItemPrice}
                                    items={priceValueOptions}
                                    textInputProps={styles.priceInput}
                                    style={{ inputAndroid: { color: Colors.textDark } }}
                                />
                            </View>
                        </View>
                        <View style={styles.inputDetails}>
                            <Text style={styles.headerText}>Links</Text>
                            {links.map((link, i) => (
                                <View key={i} style={styles.linkList}>
                                    <Text style={styles.listInputTextBold}>{link.linkDescription}</Text>
                                    <Text style={styles.listInputText}>{link.link}</Text>
                                </View>
                            ))}
                            {linkInputVisible ? (
                                <View style={styles.linkInput}>
                                    <Text style={styles.headerText}>Link Description</Text>
                                    <TextInput
                                        style={styles.listInput}
                                        onChangeText={setLinkDescription}
                                        value={linkDescription}
                                        multiline={true}
                                        textAlignVertical='center'
                                        autoCorrect={false}
                                    />
                                    <Text style={styles.headerText}>Link</Text>
                                    <TextInput
                                        style={styles.listInput}
                                        onChangeText={setLink}
                                        value={link}
                                        multiline={true}
                                        textAlignVertical='center'
                                        keyboardType='email-address'
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    /> 
                                        {linkError ? (
                                            <Text style={styles.listInputText}>{linkError}</Text>    
                                        ) : null }
                                    <TouchableOpacity style={styles.saveLinkButton} disabled={buttonDisabled} onPress={updateLinks}>
                                        <Text style={styles.newListText}>Save Link</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                            <TouchableOpacity style={styles.addLinkButton} onPress={() => setLinkInputVisible(true)}>
                                <Text style={styles.addLinkButtonText}>Add a link</Text>
                                <Ionicons name="add-circle-outline" size={24} color={Colors.textDark} />
                            </TouchableOpacity>
                            )}
                      
                        </View>       
                    </View>
                    {inputError ? <Text style={styles.errorText}>{inputError}</Text> : null}
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.newListButton} disabled={saveButtonDisabled} onPress={addItemToList}>
                        <Text style={styles.newListText}>Save Item</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        color: Colors.textLight,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
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
        marginTop: 45,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    inputContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingBottom: 200
    },
    input: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
    descriptionLineAsterisk: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
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
    asterisk: {
        color: Colors.textDelete,
        paddingTop: 20,
        paddingLeft: 5
    },
    listInput: {
        minHeight: 50,
        borderRadius: 5,
        width: '90%',
        marginLeft: 20,
        paddingLeft: 10,
        fontSize: 18,
        backgroundColor: Colors.background,
        color: Colors.textDark,
        textAlign: 'left',
        justifyContent: 'center'
    },
    priceInput: {
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left'
    },
    linkList: {
        paddingLeft: '5%'
    },
    listInputText: {
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left'
    },
    listInputTextBold: {
        //paddingLeft: 20,
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left',
        fontWeight: 'bold',
        paddingTop: 5
    },
    linkInput: {
        justifyContent: 'flex-start',
    },
    saveLinkButton: {
        height: 60,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '60%',
        marginTop: 20,
        marginLeft: '20%'
    },
    newListText:{
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
    addLinkButton:{
        width: '90%',
        height: 60,
        backgroundColor: Colors.newLinkButton,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 20
    },
    addLinkButtonText: {
        color: Colors.textDark,
        fontSize: 18,
        fontWeight: 'bold',
        paddingRight: 5
    },
    errorText: {
        color: Colors.textDelete
    },
    newListButton:{
        height: 60,
        borderWidth: 2,
        borderColor: Colors.button,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
        width: 250,
    },   
    buttonContainer: {
        width: '100%',
        backgroundColor: Colors.background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        zIndex: 101,
    }
})

export default AddItem;