import React from 'react';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';

import { AntDesign } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';  


//import updateAction from '../Utils/updateAction';

const ItemPurchase = ({item, userId, listId, setPurchasedModalVisible, setCurrentItem, setListId = () => {}}) => {


    if (item.actions.personId === userId && item.actions.action === 'purchased') {
        return (
            <TouchableOpacity onPress={() => {setPurchasedModalVisible(true); setCurrentItem(item); setListId(listId)}}>
                <MaterialCommunityIcons name="cart-remove" size={24} color="black" />
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity onPress={() => {setPurchasedModalVisible(true); setCurrentItem(item); setListId(listId)}}>
                <AntDesign name="shoppingcart" size={24} color="black" />
            </TouchableOpacity>
        )
    }
};

export default ItemPurchase;