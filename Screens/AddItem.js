import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import isURL from 'validator/lib/isURL';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import Colors from '../Constants/Colors';


const AddItem = ({ route }) => {

    const [itemDescription, setItemDescription] = useState('');
    const [itemDetail, setItemDetail] = useState('');
    const [linkDescription, setLinkDescription] = useState('');
    const [link, setLink] = useState('');
    const [links, setLinks] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [linkError, setLinkError] = useState('');

    const navigation = useNavigation();

    const { listId } = route.params;
    let { data } = route.params;

    // console.log(itemDescription);
    // console.log(itemDetail);
    // console.log(link);
    //console.log(links);
    // console.log(buttonDisabled);

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

    const updateLinks = e => {
        if (isURL(link)) {
            const newLinkId = uuidv4();
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
    } else {
            setLinkError('This is not a valid URL')
    }};


    const addItemToList = () => {
        const newId = uuidv4();
        const newItemToAdd = {
            item: itemDescription,
            itemId: newId,
            detail: itemDetail,
            links: links
        }
        
        const currentListIndex = data.findIndex(list => list.listId === listId )
        console.log(currentListIndex);
        console.log(data);

        //update the listItems array at this index

        data[currentListIndex].listItems.push(newItemToAdd);
        
        setItemDescription('');
        setItemDetail('');
        setLinks([]);

        navigation.navigate('Chosen List', {
            listId: listId,
            listName: data[currentListIndex].listName,
            data: data
        });

    }



    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.KAVConatiner}>
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
                        <Text style={styles.headerText}>Links</Text>
                        {links.map((link, i) => (
                            <View key={i} style={styles.linkList}>
                                <Text style={styles.listInputTextBold}>{link.linkDescription}</Text>
                                <Text style={styles.listInputText}>{link.link}</Text>
                            </View>
                        ))}
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
                    <TouchableOpacity style={styles.newListButton} disabled={saveButtonDisabled} onPress={addItemToList}>
                        <Text style={styles.newListText}>Save Item</Text>
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
    },
    inputContainer: {
        paddingLeft: 5
    },
    inputContentContainer: {
        alignItems: 'center',
    },
    KAVContainer: {
        flex: 1,
        alignItems: 'center'
    },
    input: {
        flex: 1
    },
    headerText: {
        fontSize: 18,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 5,
        paddingTop: 20
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
        width: 300
    },
    newListText:{
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
        paddingTop: 5
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
    }
})

export default AddItem;