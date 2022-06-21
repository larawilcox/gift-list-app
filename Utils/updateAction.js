import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '../Constants/Api';





const updateAction = async ({ item, action, userId, listId, setData = () => {}, setModalVisible}) => {
    
    //action on a particular item has to be object of personId and 
    //action of either reserved or purchased
    const itemId = item._id;
    const token = await SecureStore.getItemAsync('token')
   
    if (item.actions.personId === '') {

        // console.log(userId)
        // console.log(action)

        try {
            const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                personId: userId,
                action: action
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const formattedList = {
                list: editedList.data.listName,
                id: editedList.data._id,
                data: editedList.data.listItems
            }
            setData(formattedList)
            setModalVisible(false)
            
            
        } catch (e) {
            console.log(e)
        }
    } else if (item.actions.personId === userId && item.actions.action === action) {
        try {
            const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                personId: '',
                action: ''
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const formattedList = {
                list: editedList.data.listName,
                id: editedList.data._id,
                data: editedList.data.listItems
            }
            setData(formattedList)
            setModalVisible(false)

        } catch (e) {
            console.log(e)
        }
    } else if (item.actions.personId === userId && item.actions.action !== action) {
        try {
            const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                personId: userId,
                action: action
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const formattedList = {
                list: editedList.data.listName,
                id: editedList.data._id,
                data: editedList.data.listItems
            }
            setData(formattedList)
            setModalVisible(false)

        } catch (e) {
            console.log(e)
        }
    }
}

export default updateAction;