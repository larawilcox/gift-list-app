import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import isURL from 'validator/lib/isURL';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';

import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';



const EditItem = ({ route }) => {

    const { listId, itemId } = route.params;
    let { data } = route.params;


    // console.log('itemId: ', itemId)
    // console.log('listId: ', listId)

    const currentItem = data.listItems.find(item => item._id === itemId);


    const [itemDescription, setItemDescription] = useState(currentItem.item);
    const [itemDetail, setItemDetail] = useState(currentItem.detail);
    const [itemPrice, setItemPrice] = useState(currentItem.price);
    const [linkDescription, setLinkDescription] = useState('');
    const [link, setLink] = useState('');
    const [links, setLinks] = useState(currentItem.links);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [linkError, setLinkError] = useState('');
    const [editLinkModalVisible, setEditLinkModalVisible] = useState(false);
    const [selectedLinkDescription, setSelectedLinkDescription] = useState('');
    const [selectedLinkLink, setSelectedLinkLink] = useState('');
    const [selectedLinkId, setSelectedLinkId] = useState('');
    const [linkInputVisible, setLinkInputVisible] = useState(false);

    const priceValueOptions = [
        { label: 'Unspecified', value: '0' },
        { label: 'Under £10', value: '1' },
        { label: '£10-£20', value: '2' },
        { label: '£20-£50', value: '3' },
        { label: '£50-£100', value: '4' },
        { label: 'Over £100', value: '5' },
    ];

    //const currentItemIndex = data.listItems.findIndex(item => item._id === itemId);

    const navigation = useNavigation();


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

    const saveNewLinkToArray = e => {
        if (isURL(link)) {
            newLinkId = uuidv4();
            setLinks([
                ...links,
                {
                    linkId: newLinkId,
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


    const deleteLinkFromArray = () => {
        const linkToDeleteIndex = links.findIndex(link => link.linkId === selectedLinkId);

        links.splice(linkToDeleteIndex, 1);

        setEditLinkModalVisible(false);

    };

    const editExistingLinkInArray = () => {
        if (isURL(selectedLinkLink)) {
            const linkToUpdateIndex = links.findIndex(link => link.linkId === selectedLinkId)

            if (linkToUpdateIndex >= 0) {
                links[linkToUpdateIndex].linkDescription = selectedLinkDescription;
                links[linkToUpdateIndex].link = selectedLinkLink;

                setEditLinkModalVisible(false);
                console.log(links)
            } else {
                //maybe add new link to links array
            }
        } else {
            setLinkError('This is not a valid URL')
        }
    };


    const saveItemChanges = async () => {

        try {
            console.log('ItemId:', itemId)
            const token = await SecureStore.getItemAsync('token')
            const editItem = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}`, {
                item: itemDescription,
                detail: itemDetail,
                price: itemPrice,
                links
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            navigation.reset({
                index: 0,
                routes: [{ name: "Chosen List", params: {
                    listId,
                    listName: data.listName
                } }],

              })

        } catch (e) {
            console.log(e)
        }
    }

    const deleteItemFromChosenList = async (listId, itemId) => {
        try {
            const token = await SecureStore.getItemAsync('token')
            const deletedItem = await axios.delete(`${BASE_URL}/lists/${listId}/listItem/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            navigation.reset({
                index: 0,
                routes: [{ name: "Chosen List", params: {
                    listId,
                    listName: data.listName
                } }],

              })
        } catch (e) {
            console.log(e)
        }
    }




    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}></View>
            <KeyboardAvoidingView style={styles.KAVContainer}>
                <ScrollView
                    style={styles.inputContainer}
                    contentContainerStyle={styles.inputContentContainer}
                    keyboardShouldPersistTaps='always'>
                    <View style={styles.input}>
                        <View style={styles.inputDetails}>
                            <Text style={styles.headerText}>Item Description</Text>
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
                                autoCorrect={false}
                            />
                            <Text style={styles.headerText}>Price Range</Text>
                            <View style={styles.listInput}>
                                <RNPickerSelect
                                    onValueChange={setItemPrice}
                                    items={priceValueOptions}
                                    textInputProps={styles.priceInput}
                                    value={itemPrice}
                                />
                            </View>
                        </View>


                        <View style={styles.inputDetails}>
                            <Text style={styles.headerText}>Links</Text>
                            {links.map((link, i) => (
                                <View key={i} style={styles.linkList}>
                                    <View style={styles.linkHeaderContainer}>
                                        <Text style={styles.listInputTextBold}>{link.linkDescription}</Text>
                                        <TouchableOpacity style={styles.editButton} onPress={() => {setEditLinkModalVisible(true); setSelectedLinkDescription(link.linkDescription); setSelectedLinkLink(link.link); setSelectedLinkId(link.linkId)}}>
                                            <FontAwesome name="edit" size={24} color={Colors.textDark} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.listInputText}>{link.link}</Text>
                                </View>
                            ))}

                            <Modal
                                visible={editLinkModalVisible}
                                transparent={true}
                            >
                                <SafeAreaView style={styles.modalContainer}> 
                                    <KeyboardAvoidingView style={styles.modalKAVContainer}>
                                        <ScrollView
                                            style={styles.modalInputContainer}
                                            contentContainerStyle={styles.inputContentContainer}
                                            keyboardShouldPersistTaps='always'
                                        >
                                            <View style={styles.modalContent}>
                                                <View style={styles.inputModal}>
                                                    <Text style={styles.modalHeaderText}>Edit Link</Text>
                                                    <View style={styles.modalInput}>
                                                        <Text style={styles.headerText}>{itemDescription}</Text>
                                                        <Text style={styles.headerText}>Link Description</Text>
                                                        <View style={styles.listInputView}>
                                                            <TextInput
                                                                style={styles.linkListInput}
                                                                onChangeText={setSelectedLinkDescription}
                                                                value={selectedLinkDescription}
                                                                multiline={true}
                                                                textAlignVertical='center'
                                                                autoCorrect={false} 
                                                            />
                                                            {selectedLinkDescription.length > 0 ? (
                                                                <TouchableOpacity style={styles.clearTextButton} onPress={() => setSelectedLinkDescription('')}>
                                                                    <AntDesign name="close" size={16} color={Colors.primary} />
                                                                </TouchableOpacity>
                                                            ) : null }
                                                        </View>
                                                        <Text style={styles.headerText}>Link</Text>
                                                        <View style={styles.listInputView}>
                                                            <TextInput
                                                                style={styles.linkListInput}
                                                                onChangeText={setSelectedLinkLink}
                                                                value={selectedLinkLink}
                                                                multiline={true}
                                                                textAlignVertical='center'
                                                                keyboardType='email-address'
                                                                autoCorrect={false}
                                                                autoCapitalize="none"
                                                            />
                                                            {selectedLinkLink.length > 0 ? (
                                                                <TouchableOpacity style={styles.clearTextButton} onPress={() => setSelectedLinkLink('')}>
                                                                    <AntDesign name="close" size={16} color={Colors.primary} />
                                                                </TouchableOpacity>
                                                            ) : null }
                                                        </View>
                                                        {linkError ? (
                                                            <Text style={styles.listInputText}>{linkError}</Text>    
                                                        ) : null }
                                                    </View>

                                                    <TouchableOpacity style={styles.deleteButton} onPress={deleteLinkFromArray}>
                                                        <Text style={styles.deleteButtonText}>Delete this link</Text>
                                                        <AntDesign name="delete" size={24} color={Colors.textDelete} />
                                                    </TouchableOpacity>

                                                <View style={styles.modalButtonContainer}>
                                                    <TouchableOpacity style={styles.modalButton} onPress={editExistingLinkInArray}>
                                                        <Text style={styles.modalButtonText}>Save Changes</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => {setEditLinkModalVisible(false); setSelectedLinkDescription(''); setSelectedLinkLink(''); setSelectedLinkId('')}} style={styles.modalButton}>
                                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View> 
                                        
                                        </View>
                                    </ScrollView>
                                    </KeyboardAvoidingView>
                                </SafeAreaView>                        
                            </Modal>



                            {linkInputVisible ? (
                                <View style={styles.linkInputView}>
                                <Text style={styles.headerText}>Link Description</Text>
                                <View style={styles.listInputView}>
                                    <TextInput
                                        style={styles.linkInput}
                                        onChangeText={setLinkDescription}
                                        value={linkDescription}
                                        multiline={true}
                                        textAlignVertical='center'
                                        autoCorrect={false}
                                    />
                                    {linkDescription.length > 0 ? (
                                        <TouchableOpacity style={styles.clearTextButton} onPress={() => setLinkDescription('')}>
                                            <AntDesign name="close" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                        ) : null
                                    }    
                                </View>       
                                <Text style={styles.headerText}>Link</Text>
                                <View style={styles.listInputView}>
                                    <TextInput
                                        style={styles.linkInput}
                                        onChangeText={setLink}
                                        value={link}
                                        multiline={true}
                                        textAlignVertical='center'
                                        keyboardType='email-address'
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    /> 
                                    {link.length > 0 ? (
                                        <TouchableOpacity style={styles.clearTextButton} onPress={() => setLink('')}>
                                            <AntDesign name="close" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                        ) : null
                                    }    
                                </View>
                                    {linkError ? (
                                        <Text style={styles.listInputText}>{linkError}</Text>    
                                    ) : null }

                                    <TouchableOpacity style={styles.saveLinkButton} disabled={buttonDisabled} onPress={saveNewLinkToArray}>
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

                    <TouchableOpacity style={styles.deleteButton} disabled={saveButtonDisabled} onPress={() => deleteItemFromChosenList(listId, itemId)}>
                        <Text style={styles.deleteButtonText}>Delete this item</Text>
                        <AntDesign name="delete" size={24} color={Colors.textDelete} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.newListButton} disabled={saveButtonDisabled} onPress={saveItemChanges}>
                        <Text style={styles.buttonText}>Save Changes</Text>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative'
    },
    header: {
        height: 80,
        width: '100%',
        backgroundColor: Colors.primary,
    },
    KAVContainer: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100,
        marginTop: 45,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    inputContainer: {
        paddingLeft: 5,
        width: '100%'
    },
    inputContentContainer: {
        alignItems: 'center',
        
    },
    input: {
        flex: 1
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
    inputDetails: {
        width: 380,
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
    linkHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    headerTextLinks: {
        fontSize: 22,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 15,
        paddingTop: 20,
        width: '90%'
    },
    addLinkIcon: {
        fontWeight: 'bold',
        paddingTop: 5
    },
    listInput: {
        minHeight: 50,
        // borderWidth: 2,
        // borderColor: Colors.primary,
        borderRadius: 5,
        width: '90%',
        marginLeft: 20,
        paddingLeft: 10,
        // paddingRight: 10,
        fontSize: 18,
        backgroundColor: Colors.background,
        color: Colors.textDark,
        textAlign: 'left',
        justifyContent: 'center',
    },
    linkInput: {
        minHeight: 50,
        borderRadius: 5,
        width: '90%',
        paddingLeft: 10,
        fontSize: 18,
        backgroundColor: Colors.background,
        color: Colors.textDark,
        textAlign: 'left',
        justifyContent: 'center',
    },
    listInputView: {
        width: '90%',
        paddingRight: 10,
        marginLeft: 20,
        backgroundColor: Colors.background,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    newListButton:{
        height: 60,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 250,
        marginTop: 50,
    },
    buttonText:{
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
    listInputText: {
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left',
        marginRight: 20
    },
    linkErrorText: {
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left',
        paddingLeft: 20
    },
    listInputTextBold: {
        //paddingLeft: 20,
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left',
        fontWeight: 'bold',
        paddingTop: 5,
        width: '87%'
    },
    saveLinkButton: {
        height: 60,
        borderWidth: 2,
        borderColor: Colors.button,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '60%',
        marginLeft: '20%',
        marginTop: 20
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    editLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '90%',
        minHeight: 40
    },
    spacer: {
        width: 10
    },
    linkList: {
        paddingBottom: 20
    },
    modalContentContainer: {
        width: '94%',
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        paddingTop: 30,
        alignItems: 'center',
        backgroundColor: Colors.background,
        marginTop: 120,
        marginLeft: '3%'
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
    modalButtonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 60
    },
    modalButton:{
        height: 60,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 135,
        marginTop: 50,
    },
    modalButtonText:{
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
    inputModal: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 300
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 300
    },
    clearTextButton: {
        paddingTop: 8,
        width: '5%'
    },
    linkListInput: {
            minHeight: 50,
            width: '90%',
            // paddingLeft: 10,
            // paddingRight: 10,
            fontSize: 18,
            color: Colors.primary,
            textAlign: 'left',
            backgroundColor: Colors.background
    },
    listItemText: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'left',
        width: 310,
        paddingLeft: 20
    },
    listItemTextTitle: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        fontWeight: 'bold',
        textAlign: 'left',
        width: 310,
        paddingLeft: 20
    },
    modalHeaderText: {
        fontSize: 26,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 5,
        paddingTop: 20
    },
    priceInput: {
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left'
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
    linkList: {
        paddingLeft: '5%'
    },
    editButton: {
        paddingRight: 50
    },
    newListText: {
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
    deleteButton: {
        width: '90%',
        height: 60,
        backgroundColor: Colors.deleteButton,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    deleteButtonText: {
        color: Colors.textDelete,
        fontSize: 18,
        fontWeight: 'bold',
        paddingRight: 5
    },
    modalContainer: {
       //backgroundColor: Colors.background,
       backgroundColor: '#00000080',
       flex: 1,
       justifyContent: 'flex-start',
       alignItems: 'center',
       width: '100%'
    },
    modalKAVContainer: {
        flex: 1
    },
    modalInputContainer: {
        paddingLeft: 5,
        width: 380,

        borderRadius: 5,
        backgroundColor: Colors.secondary,
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
    },
    modalInput: {
        flex: 1,
        marginBottom: 30
    }
})

export default EditItem;