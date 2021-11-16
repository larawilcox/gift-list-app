import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
 
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Octicons } from '@expo/vector-icons';

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






    const Item = ({ listName, listId, listDate, data }) => {
        const navigation = useNavigation();
        
        //console.log('My Lists', dataItems);
        return (
        <TouchableOpacity onPress={()=> {
            navigation.navigate('Chosen List', {
                listId,
                listName,
                listDate
            }); console.log(listName, listId)}} style={styles.listItem}>
                <Text style={styles.listNameText}>{listName}</Text>
                <Octicons name="chevron-right" size={24} color={Colors.textDark} />
                
            {/* <TouchableOpacity onPress={() => navigation.navigate('Share List', {listId: listId, data: data})}>
                <Feather name="share" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.spacer}></View>
            <TouchableOpacity onPress={() => navigation.navigate('Edit List', {oldListName: listName, oldListId: listId, oldListDate: listDate, data: data})}>
                <Feather name="edit" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.spacer}></View>
            <TouchableOpacity onPress={() => {setModalVisible(true); setSelectedList(listName); setSelectedListId(listId)}}>
                <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity> */}
        </TouchableOpacity>
    )};

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.KAVContainer}>
                <View style={styles.header}></View>
                <View style={styles.listView}>
                    <FlatList 
                        data={listData}
                        renderItem={({ item }) => (
                            <Item listName={item.listName} listId={item._id} listDate={item.occasionDate} data={listData} />)}
                        keyExtractor={item => item._id}
                        style={styles.list}
                    />
                    {/* <Modal
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
                    </Modal> */}
                    <TouchableOpacity style={styles.newListButton} onPress={() => navigation.navigate('Add New List', {data: dataItems})}>
                        <Text style={styles.newListText}>Add a new list</Text>
                    </TouchableOpacity>
                </View>
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
        width: '100%',
        height: '100%'
    },
    KAVContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    header: {
        height: 80,
        width: '100%',
        backgroundColor: Colors.primary,
        color: 'black'
    },
    listItem: {
        flexDirection: 'row',
        minHeight: 70,
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: 9,
        width: '95%',
        paddingRight: 12,
        backgroundColor: Colors.secondary,
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
    },
    listView:{
        flex: 1,
        paddingTop: 50,
        zIndex: 100,
        position: 'absolute',
        height: '100%',
        alignItems: 'center'
    },
    list: {
        flex: 1
    },
    listNameText: {
        fontSize: 20,
        color: Colors.textDark,
        textAlign: 'left',
        width: '95%',
        paddingLeft: 20,
        fontWeight: 'bold'
    },
    newListButton:{
        height: 60,
        borderWidth: 2,
        borderColor: Colors.button,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 250
    },
    newListText:{
        color: Colors.textLight,
        fontSize: 22,
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