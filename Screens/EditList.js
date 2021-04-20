import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import 'react-native-get-random-values';

import Colors from '../Constants/Colors';


const EditList = ({ route }) => {

    const navigation = useNavigation();

    const { oldListName, oldListId, oldListDate } = route.params;
    let { data } = route.params;

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


    const EditList = () => {
        const currentListIndex = data.findIndex(list => list.listId === oldListId);

        data[currentListIndex].listName = listName;
        data[currentListIndex].listDate = date.toDateString();

        console.log(data);

        navigation.navigate('Chosen List', {
            listId: data[currentListIndex].listId,
            listName: data[currentListIndex].listName,
            data: data
        });

    };


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
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
        // paddingTop: 50
    },
    input: {
        flex: 1
    },
    headerText: {
        fontSize: 18,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 10,
        paddingTop: 40
    },
    listInput: {
        minHeight: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        width: 300,
        paddingLeft: 20,
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
    datePicker: {
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        width: 300,
        paddingLeft: 20,
    }
})

export default EditList;