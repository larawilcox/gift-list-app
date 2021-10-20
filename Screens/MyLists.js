import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
 
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';

import { Data as dataItems } from '../Data/DummyData';




const MyLists = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedList, setSelectedList] = useState('');
    const [selectedListId, setSelectedListId] = useState('');
    const [listData, setListData] = useState([]);

    const fetchData = async () => {
        try {
            const token = await SecureStore.getItemAsync('token')
            const myLists = await axios.get(`${BASE_URL}/lists`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setListData(myLists.data);
        } catch (e) {
            console.log(e);
        }


    };

    useEffect(() => {
        void fetchData();
    }, []);


    //function to delete list from the data file
    const deleteListFromMyLists = async () => {
        console.log(selectedListId);
        try {
            const token = await SecureStore.getItemAsync('token')
            const deletedList = await axios.delete(`${BASE_URL}/lists/${selectedListId}`, {
                headers: {
                    Authorization: `Bearer ${token} `
                }
            })
            await fetchData()
        } catch (e) {
            console.log(e)
        }

        setModalVisible(false);

    };


    const Item = ({ listName, listId, listDate, data }) => {
        const navigation = useNavigation();
        
        //console.log('My Lists', dataItems);
        return (
        <TouchableOpacity onPress={()=> {
            navigation.navigate('Chosen List', {
                listId: listId,
                listName: listName,
                data: data
            }); console.log(listName, listId)}} style={styles.listItem}>
            <Text style={styles.listNameText}>{listName}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Share List', {listId: listId, data: data})}>
                <Feather name="share" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.spacer}></View>
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
                    data={listData}
                    renderItem={({ item }) => (
                        <Item listName={item.listName} listId={item._id} listDate={item.occasionDate} data={listData} />)}
                    keyExtractor={item => item._id}
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
        marginLeft: 9,
        width: '95%',
        paddingRight: 12
    },
    list: {
        paddingTop: 30
    },
    listNameText: {
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left',
        width: '75%',
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