import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import isURL from 'validator/lib/isURL';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import Colors from '../Constants/Colors';

import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 



const EditItem = ({ route }) => {

    const { listId, itemId } = route.params;
    let { data } = route.params;

    const currentList = data.find(list => list.listId === listId);
    const currentItem = currentList.listItems.find(item => item.itemId === itemId);


    const [itemDescription, setItemDescription] = useState(currentItem.item);
    const [itemDetail, setItemDetail] = useState(currentItem.detail);
    const [linkDescription, setLinkDescription] = useState('');
    const [link, setLink] = useState('');
    const [links, setLinks] = useState(currentItem.links);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [linkError, setLinkError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [addLinkModalVisible, setAddLinkModalVisible] = useState(false);
    const [editLinkModalVisible, setEditLinkModalVisible] = useState(false);
    const [selectedLinkDescription, setSelectedLinkDescription] = useState('');
    const [selectedLinkLink, setSelectedLinkLink] = useState('');
    const [selectedLinkId, setSelectedLinkId] = useState('');


    const currentListIndex = data.findIndex(list => list.listId === listId);
    const currentItemIndex = currentList.listItems.findIndex(item => item.itemId === itemId);

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
            setAddLinkModalVisible(false);
    } else {
            setLinkError('This is not a valid URL')
    }};


    const deleteLinkFromArray = () => {
        const linkToDeleteIndex = links.findIndex(link => link.linkId === selectedLinkId);

        links.splice(linkToDeleteIndex, 1);

        setModalVisible(false);

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

    const saveItemChanges = () => {
        data[currentListIndex].listItems[currentItemIndex].item = itemDescription;
        data[currentListIndex].listItems[currentItemIndex].detail = itemDetail;
        data[currentListIndex].listItems[currentItemIndex].links = links;

        navigation.navigate('Chosen List', {
            listId: listId,
            listName: data[currentListIndex].listName,
            data: data
        });
    }




    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <ScrollView
                    style={styles.inputContainer}
                    contentContainerStyle={styles.inputContentContainer}
                    keyboardShouldPersistTaps='always'>
                    <View style={styles.input}>
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
                        <View style={styles.linkHeaderContainer}>
                            <Text style={styles.headerTextLinks}>Links</Text>
                            <TouchableOpacity onPress={() => setAddLinkModalVisible(true)}>
                                <Feather name="plus" size={24} color="black" style={styles.addLinkIcon} />
                            </TouchableOpacity>
                        </View>

                        <Modal
                            visible={addLinkModalVisible}
                        >
                            <SafeAreaView style={styles.container}> 
                                <KeyboardAvoidingView>
                                <ScrollView
                                    style={styles.inputContainer}
                                    contentContainerStyle={styles.inputContentContainer}
                                    keyboardShouldPersistTaps='always'>
                                    <View style={styles.modalContent}>
                                        <View style={styles.inputModal}>
                                            <Text style={styles.modalHeaderText}>Add Link</Text>
                                            <View style={styles.input}>
                                                <Text style={styles.headerText}>Link Description</Text>
                                                <View style={styles.listInputView}>
                                                    <TextInput
                                                        style={styles.linkListInput}
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
                                                        style={styles.linkListInput}
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
                                        </View>
                                        </View>
                                        <View style={styles.modalButtonContainer}>
                                            <TouchableOpacity style={styles.modalButton} onPress={saveNewLinkToArray}>
                                                <Text style={styles.modalButtonText}>Save Link</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {setAddLinkModalVisible(false); setLink(''); setLinkDescription('')}} style={styles.modalButton}>
                                                <Text style={styles.modalButtonText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    </ScrollView>
                                </KeyboardAvoidingView>
                            </SafeAreaView>
                        </Modal>

                        {links.map((link, i) => (
                            <View key={i} style={styles.linkList}>
                                <View style={styles.editLinkContainer}>
                                    <Text style={styles.listInputTextBold}>{link.linkDescription}</Text>
                                    <TouchableOpacity onPress={() => {setEditLinkModalVisible(true); setSelectedLinkDescription(link.linkDescription); setSelectedLinkLink(link.link); setSelectedLinkId(link.linkId)}}>
                                        <Feather name="edit" size={24} color="black" />
                                    </TouchableOpacity>

                                    <Modal
                                        visible={editLinkModalVisible}
                                    >
                                         <SafeAreaView style={styles.container}> 
                                            <KeyboardAvoidingView>
                                            <ScrollView
                                                style={styles.inputContainer}
                                                contentContainerStyle={styles.inputContentContainer}
                                                keyboardShouldPersistTaps='always'>
                                                <View style={styles.modalContent}>
                                                <View style={styles.inputModal}>
                                                <Text style={styles.modalHeaderText}>Edit Link</Text>
                                                    <View style={styles.input}>
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

                                    <View style={styles.spacer}></View>
                                    <TouchableOpacity onPress={() => {setModalVisible(true); setSelectedLinkDescription(link.linkDescription); setSelectedLinkLink(link.link); setSelectedLinkId(link.linkId)}}>
                                        <AntDesign name="delete" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <Modal
                                    visible={modalVisible}
                                    transparent={true}
                                >
                                    <View style={styles.modalContentContainer}>
                                        <Text style={styles.text}>Delete Link</Text>
                                        <Text style={styles.text}>{selectedLinkDescription}</Text>
                                        <Text style={styles.text} numberOfLines={4} ellipsizeMode='tail'>{selectedLinkLink} ?</Text>
                                        <View style={styles.modalButtonContainer}>
                                            <TouchableOpacity style={styles.modalButton} onPress={deleteLinkFromArray}>
                                                <Text style={styles.modalButtonText}>Delete</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {setModalVisible(false)}} style={styles.modalButton}>
                                                <Text style={styles.modalButtonText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                                <Text style={styles.listInputText} numberOfLines={2} ellipsizeMode='tail'>{link.link}</Text>
                            </View>
                        ))}
                    </View>
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
        color: Colors.textLight,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    inputContainer: {
        paddingLeft: 5,
        width: '90%'
    },
    inputContentContainer: {
        alignItems: 'center',
    },
    input: {
        flex: 1
    },
    headerText: {
        fontSize: 20,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 5,
        paddingTop: 20,
        width: 300
    },
    linkHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
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
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        width: 300,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left'
    },
    newListButton:{
        height: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 300,
        marginTop: 10
    },
    buttonText:{
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
    listInputText: {
        //paddingLeft: 20,
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
        paddingTop: 5,
        width: '90%'
    },
    saveLinkButton: {
        height: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 300,
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
        height: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 135
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
    listInputView: {
        minHeight: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        width: 300,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    linkListInput: {
            minHeight: 50,
            width: '90%',
            // paddingLeft: 10,
            // paddingRight: 10,
            fontSize: 18,
            color: Colors.primary,
            textAlign: 'left'
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
    }
})

export default EditItem;