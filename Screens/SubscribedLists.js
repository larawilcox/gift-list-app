import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, KeyboardAvoidingView, SectionList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import Colors from '../Constants/Colors';
import { SubscribedListsData as Data } from '../Data/SubscribedListsData';
import { BASE_URL } from '../Constants/Api';

const SubscribedLists = () => {

    const [sectionListData, setSectionListData] = useState([])

    

    const fetchData = async () => {
        try {
            const token = await SecureStore.getItemAsync('token')
            const mySubscribedLists = await axios.get(`${BASE_URL}/users/me/subscribedLists`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(mySubscribedLists)

            const sectionListData = mySubscribedLists.data.map(section => {
                return { title: section.forename, _id: section._id, email: section.email, data: section.lists.map(list => {
                    return { list: list.listName, id: list._id }
                })}
            });
            setSectionListData(sectionListData);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const navigation = useNavigation();

    const Item = ({ list, friend, data }) => {
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Subscribed To List', {
                friendId: friend.id,
                listName: list.list,
                listId: list.id,
                data: data
            })}>
                <Text style={styles.listNameText}>{list.list}</Text>
            </TouchableOpacity>
        )
    }



    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
            <SectionList
                sections={sectionListData}
                //keyExtractor={}
                renderItem={({ item, section }) => <Item list={item} friend={section} data={Data} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.headerText}>{title}'s Lists</Text>
                )}
            />             
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
        alignItems: 'center'
    },
    text: {
        textAlign: 'center'
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
        width: '98%',
        paddingRight: 40
    },
    listNameText: {
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left',
        width: 310,
        paddingLeft: 20
    },
    headerText: {
        fontSize: 20,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 5,
        paddingTop: 20,
        width: '100%', 
        backgroundColor: Colors.background
    },
})

export default SubscribedLists;