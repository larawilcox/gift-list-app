import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import Colors from '../Constants/Colors';

import { AntDesign } from '@expo/vector-icons'; 


//import updateAction from '../Utils/updateAction';


const ItemReserve = ({item, userId, listId, setReservedModalVisible, setCurrentItem, setListId = () => {}}) => {

    console.log('listId: ', listId);   

    if (item.actions.personId === userId && item.actions.action === 'reserved') {
        return (
            <TouchableOpacity onPress={() => {setReservedModalVisible(true); setCurrentItem(item); setListId(listId)}}>
                <AntDesign name="unlock" size={24} color="black" />
            </TouchableOpacity>
        )
    } else if (item.actions.personId === userId && item.actions.action === 'purchased') {
        return null;
    } else {
        return (
            <TouchableOpacity onPress={() => {setReservedModalVisible(true); setCurrentItem(item); setListId(listId)}}>
                <AntDesign name="lock1" size={24} color="black" />
            </TouchableOpacity>
        )
    }

    
};

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#00000080',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    modalInputContainer: {
        paddingLeft: 5,
        width: '95%',
        height: 380,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
        marginTop: 100
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
        height: 60,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 135,
        marginTop: 50,
    },
    buttonText:{
        color: Colors.textLight,
        fontSize: 18,
        fontWeight: 'bold'
    },
})

export default ItemReserve;