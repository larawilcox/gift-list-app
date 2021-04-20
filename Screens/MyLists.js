import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

import Colors from '../Constants/Colors';

import { Data as dataItems } from '../Data/DummyData';






const MyLists = () => {


    const [modalVisible, setModalVisible] = useState(false);
    const [selectedList, setSelectedList] = useState('');
    const [selectedListId, setSelectedListId] = useState('');


    //function to delete list from the data file
    const deleteListFromMyLists = () => {
        const currentListIndex = dataItems.findIndex(list => list.listId === selectedListId);

        dataItems.splice(currentListIndex, 1);

        setModalVisible(false);

        navigation.navigate('My Lists');
    };


    const Item = ({ listName, listId, listDate, data }) => {
        const navigation = useNavigation();

        //console.log('My Lists', dataItems);
        return (
        <TouchableOpacity onPress={()=> navigation.navigate('Chosen List', {
            listId: listId,
            listName: listName,
            data: data
        })} style={styles.listItem}>
            <Text style={styles.listNameText}>{listName}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Edit List', {oldListName: listName, oldListId: listId, oldListDate: listDate, data: data})}>
                <Feather name="edit" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.spacer}></View>
            <TouchableOpacity onPress={() => {setModalVisible(true); setSelectedList(listName); setSelectedListId(listId)}}>
                <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>
        </TouchableOpacity>
    )};

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.KAVContainer}>
                <FlatList 
                    data={dataItems}
                    renderItem={({ item }) => (
                        <Item listName={item.listName} listId={item.listId} listDate={item.listDate} data={dataItems} />)}
                    keyExtractor={item => item.listId}
                    style={styles.list}
                />
                <Modal
                    visible={modalVisible}
                    transparent={true}
                >
                        <View style={styles.contentContainer}>
                            <Text style={styles.text}>Delete List</Text>
                            <Text style={styles.text}>{selectedList} ?</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={deleteListFromMyLists}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setModalVisible(false)}} style={styles.button}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </Modal>
                <TouchableOpacity style={styles.newListButton} onPress={() => navigation.navigate('Add New List', {data: dataItems})}>
                    <Text style={styles.newListText}>Add a new list</Text>
                </TouchableOpacity>
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
    },
    KAVContainer: {
        flex: 1,
        alignItems: 'center'
    },
    listItem: {
        flexDirection: 'row',
        minHeight: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        width: 380,
        paddingRight: 40
    },
    list: {
        paddingTop: 30
    },
    listNameText: {
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left',
        width: 310,
        paddingLeft: 20
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
    spacer: {
        width: 10
    },
    contentContainer: {
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
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 60
    },
    button:{
        height: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 120
    },
    buttonText:{
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
})

export default MyLists;