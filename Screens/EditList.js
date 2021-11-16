import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import 'react-native-get-random-values';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';

import { AntDesign } from '@expo/vector-icons';

const EditList = ({ route }) => {

    const navigation = useNavigation();

    const { oldListName, oldListId, oldListDate } = route.params;
    const [listName, setListName] = useState(oldListName);
    const [date, setDate] = useState(new Date(oldListDate));
    const [buttonDisabled, setButtonDisabled] = useState(true);
    

    useEffect(() => {
        if (listName.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [listName]);


    const EditList = async () => {

        try {
            const token = await SecureStore.getItemAsync('token')
            const editList = await axios.patch(`${BASE_URL}/lists/${oldListId}`, {
                listName,
                occasionDate: date,

            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            navigation.navigate('My Lists');
        } catch (e) {
            console.log(e)
        }


    };

    const deleteListFromMyLists = async () => {
        console.log(oldListId);
        try {
            const token = await SecureStore.getItemAsync('token')
            const deletedList = await axios.delete(`${BASE_URL}/lists/${oldListId}`, {
                headers: {
                    Authorization: `Bearer ${token} `
                }
            })
            await fetchData()
        } catch (e) {
            console.log(e)
        }

        navigation.reset({
            index: 0,
            routes: [{ name: "My Lists" }]
          })

    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}></View>
            <KeyboardAvoidingView style={styles.KAVContainer}>
                <View style={styles.input}>
                    <Text style={styles.headerText}>List Name:</Text>
                    <TextInput
                        style={styles.listInput}
                        onChangeText={setListName}
                        value={listName}
                        autofocus={true}
                        autoCorrect={false}
                        // onSubmitEditing={move focus to date input}
                    />
                    <Text style={styles.headerText}>Date of Occasion:</Text>
                    <DatePicker
                        style={styles.datePicker}
                        mode='date'
                        date={date}
                        onDateChange={setDate}
                        textColor={Colors.primary}
                    />
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={deleteListFromMyLists}>
                        <Text style={styles.deleteButtonText}>Delete this list</Text>
                        <AntDesign name="delete" size={24} color={Colors.textDelete} />
                    </TouchableOpacity>
                <TouchableOpacity style={styles.newListButton} disabled={buttonDisabled} onPress={EditList}>
                    <Text style={styles.newListText}>Save Changes</Text>
                </TouchableOpacity>
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
        position: 'relative'
        // paddingTop: 50
    },
    KAVContainer: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100,
        marginTop: 45
    },
    input: {
        width: 380,
        backgroundColor: Colors.secondary,
        paddingBottom: 20,
        justifyContent: 'center',
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
        flex: 1
    },
    headerText: {
        fontSize: 18,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 10,
        paddingTop: 40,
        paddingLeft: 20
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
    newListText:{
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
    datePicker: {
        width: 380,
        paddingLeft: 20,
    },
    header: {
        height: 80,
        width: '100%',
        backgroundColor: Colors.primary,
        color: 'black'
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
})

export default EditList;