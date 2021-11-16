import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Linking, Modal, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';

import { AntDesign } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const priceValueOptions = [
    { label: '£ Not specified', value: '0' },
    { label: 'Under £10', value: '1' },
    { label: '£10-£20', value: '2' },
    { label: '£20-£50', value: '3' },
    { label: '£50-£100', value: '4' },
    { label: 'Over £100', value: '5' },
];






const SubscribedToList = ({ route }) => {
    
    const { ownerId, listName, ownerName } = route.params;
    const [data, setData]  = useState(route.params.data);
    console.log('data: ', data)
 
    const [myId, setMyId] = useState('');

    const fetchUserId = async () => {
        const userId = await AsyncStorage.getItem('userId');
        setMyId(userId);
        console.log('userId: ', userId)
    }

    useEffect(() => {
        void fetchUserId();
    }, []);
    
    //console.log('myId: ', myId)
    const [toggleDetail, setToggleDetail] = useState();
    


    const Item = ({ data, myId, itemId, toggleDetail, setToggleDetail }) => {

        //console.log('item Id: ', itemId)
        //console.log('Data: ', data);
        //console.log('my Id: ', myId)
        
        const currentItem = data.data.find(item => item._id === itemId)
        
        const itemPrice = priceValueOptions.find(itemPrice => currentItem.price === itemPrice.value);
        const [reservedModalVisible, setReservedModalVisible] = useState(false);
        const [purchasedModalVisible, setPurchasedModalVisible] = useState(false);
        const [action, setAction] = useState('');
    
        const updateActionReserved = async (itemId) => {
    
            //action on a particular item has to be object of personId and 
            //action of either reserved or purchased
            const listId = data.id;
            //console.log('current item: ', currentItem)

            if (currentItem.actions.personId === '') {

                try {
                    const token = await SecureStore.getItemAsync('token')
                    const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                        personId: myId,
                        action: 'reserved'
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    //format returned data
                    const formattedList = {
                        list: editedList.data.listName,
                        id: editedList.data._id,
                        data: editedList.data.listItems
                    }
                    setData(formattedList)
                    setReservedModalVisible(false)
                } catch (e) {
                    console.log(e)
                }
            } else if (currentItem.actions.personId === myId) {
                try {
                    const token = await SecureStore.getItemAsync('token')
                    const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                        personId: '',
                        action: ''
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    //format returned data
                    const formattedList = {
                        list: editedList.data.listName,
                        id: editedList.data._id,
                        data: editedList.data.listItems
                    }
                    setData(formattedList)
                    setReservedModalVisible(false)
                } catch (e) {
                    console.log(e)
                }
            }
        }

        const updateActionPurchased = async (itemId) => {
    
            //action on a particular item has to be object of personId and 
            //action of either reserved or purchased
            const listId = data.id;
            //console.log('current item: ', currentItem)

            if (currentItem.actions.personId === '') {

                try {
                    const token = await SecureStore.getItemAsync('token')
                    const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                        personId: myId,
                        action: 'purchased'
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    //format returned data
                    const formattedList = {
                        list: editedList.data.listName,
                        id: editedList.data._id,
                        data: editedList.data.listItems
                    }
                    setData(formattedList)
                    setPurchasedModalVisible(false)
                } catch (e) {
                    console.log(e)
                }
            } else if (currentItem.actions.personId === myId) {
                try {
                    const token = await SecureStore.getItemAsync('token')
                    const editedList = await axios.patch(`${BASE_URL}/lists/${listId}/listItem/${itemId}/actions`, {
                        personId: '',
                        action: ''
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    //format returned data
                    const formattedList = {
                        list: editedList.data.listName,
                        id: editedList.data._id,
                        data: editedList.data.listItems
                    }
                    setData(formattedList)
                    setPurchasedModalVisible(false)
                } catch (e) {
                    console.log(e)
                }
            }
        }
    
    if (currentItem.actions.action !== '' && currentItem.actions.personId !== myId) {
    
        return (
            <View style={styles.listItem}>
                <View style={styles.titleLineTaken}>
                    <Text style={styles.listItemTextTaken}>{currentItem.item}</Text>
                    <Text style={styles.listItemTextAction}>{currentItem.actions.action}</Text>
                </View>
            </View>
        )
    } else {
        return (
        <TouchableOpacity onPress={()=> {setToggleDetail(toggleDetail === itemId ? '' : itemId)}}>
            {itemId === toggleDetail ? (
                <View style={styles.listItemDetail}>
                    <View style={styles.titleLine}>
                        <Text style={styles.listItemText, styles.listItemTextTitle}>{currentItem.item}</Text> 
                            {(currentItem.actions.personId === myId && currentItem.actions.action === 'purchased' ) ? (
                            <View style={styles.spacerReserved}></View> 
                        ) : (
                            <TouchableOpacity onPress={() => {setReservedModalVisible(true)}}>
                                {(currentItem.actions.personId === myId && currentItem.actions.action === 'reserved' ) ? (
                                //{reservedItemsArray.find(item => item === itemId) ? (
                                    <AntDesign name="unlock" size={24} color="black" />
                                ) : (
                                    <AntDesign name="lock1" size={24} color="black" />
                                )}
                            </TouchableOpacity>
                        ) }
                            <View style={styles.spacer}></View>
                            <TouchableOpacity onPress={() => {setPurchasedModalVisible(true)}}>
                                {(currentItem.actions.personId === myId && currentItem.actions.action === 'purchased' ) ? (
                                //{purchasedItemsArray.find(item => item === itemId) ? (
                                    <MaterialCommunityIcons name="cart-remove" size={24} color="black" />
                                    ) : (
                                    <AntDesign name="shoppingcart" size={24} color="black" />
                                )}
                            </TouchableOpacity>
                    </View>
    
                    { currentItem.price ?  
                        <Text style={styles.listItemText}>{itemPrice.label}</Text>
                        : null
                    }
                    { currentItem.detail ?
                    <Text style={styles.listItemText}>{currentItem.detail}</Text>
                    : null
                    }
                    {currentItem.links ? 
                    currentItem.links.map(link => 
                        <Text style={styles.listItemLinkText} key={link.link} onPress={() => Linking.openURL(link.link)}>{link.linkDescription ? link.linkDescription : 'Link'}</Text>
                        )
                    : null
                    }
                </View>
            ) :
                <View style={styles.listItem}>
                    <Text style={styles.listItemText}>{currentItem.item}</Text>
                    {(currentItem.actions.personId === myId && currentItem.actions.action === 'purchased' ) ? (
                        <View style={styles.spacerReserved}></View> 
                    ) : (
                        <TouchableOpacity onPress={() => {setReservedModalVisible(true)}}>
                            {(currentItem.actions.personId === myId && currentItem.actions.action === 'reserved' ) ? (
                                <AntDesign name="unlock" size={24} color="black" />
                            ) : (
                                <AntDesign name="lock1" size={24} color="black" />
                            )}
                        </TouchableOpacity>
                    ) }
                    <View style={styles.spacer}></View>
                    <TouchableOpacity onPress={() => {setPurchasedModalVisible(true)}}>
                        {(currentItem.actions.personId === myId && currentItem.actions.action === 'purchased' ) ? (
                            <MaterialCommunityIcons name="cart-remove" size={24} color="black" />
                            ) : (
                            <AntDesign name="shoppingcart" size={24} color="black" />
                        )}
                    </TouchableOpacity>
                </View>
            }
    
    
    
            <Modal
                visible={reservedModalVisible}
                transparent={true}
            >
                    <View style={styles.contentContainer}>
                        {(currentItem.actions.personId === myId && currentItem.actions.action === 'reserved' ) ? (
                            <Text style={styles.text}>Release this item</Text> ) : (
                                <Text style={styles.text}>Reserve this item</Text>
                            )
                        }   
                        <Text style={styles.text}>{currentItem.item} ?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() =>  updateActionReserved(currentItem._id)}>
                            {(currentItem.actions.personId === myId && currentItem.actions.action === 'reserved' ) ? (
                                <Text style={styles.buttonText}>Release</Text> ) : (
                                    <Text style={styles.buttonText}>Reserve</Text>
                                )
                            } 
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {setReservedModalVisible(false)}} style={styles.button}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </Modal>
            <Modal
                visible={purchasedModalVisible}
                transparent={true}
            >
                    <View style={styles.contentContainer}>
                        {(currentItem.actions.personId === myId && currentItem.actions.action === 'purchased' ) ? (
                        //{purchasedItemsArray.find(item => item === itemId) ? (
                            <Text style={styles.text}>Release this item</Text> ) : (
                                <Text style={styles.text}>Purchase this item</Text>
                            )
                        }
                        <Text style={styles.text}>{currentItem.item} ?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => updateActionPurchased(itemId)}>
                            {(currentItem.actions.personId === myId && currentItem.actions.action === 'purchased' ) ? (
                            //{purchasedItemsArray.find(item => item === itemId) ? (
                                <Text style={styles.buttonText}>Release</Text> ) : (
                                    <Text style={styles.buttonText}>Purchase</Text>
                                )
                             } 
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {setPurchasedModalVisible(false)}} style={styles.button}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </Modal>
        </TouchableOpacity>
      )
    };
};



    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.KAVContainer}>
                <Text style={styles.listHolderNameTitle}>{ownerName}'s Lists</Text>
                { (data.data.length > 0) ? (
                <FlatList 
                    data={data.data}
                    renderItem={({ item }) => (
                        <Item 
                            myId={myId}
                            itemId={item._id}
                            data={data} 
                            toggleDetail={toggleDetail}
                            setToggleDetail={setToggleDetail}
                             />)}
                    keyExtractor={item => item._id}
                    style={styles.list}
                />
                 ) : (
                    <View style={styles.noItemsTextContainer}>
                        <Text style={styles.noItemsText}>There are no items on this list</Text>
                    </View>
                )
                }
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
    KAVContainer: {
        flex: 1,
        alignItems: 'center'
    },
    listItem: {
        minHeight: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 10,
        width: '100%',
        paddingBottom: 10,
        paddingTop: 10,
    },
    title: {
        paddingTop: 60,
        paddingBottom: 40,
        fontSize: 26,
        color: Colors.primary,
        fontWeight: 'bold'
    },
    list: {
        paddingTop: 30
    },
    addItemButton:{
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
    addItemText:{
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
    listItemTextTitle: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '80%',
        paddingLeft: 20
    },
    noItemsTextContainer: {
        flex: 1
    },
    noItemsText: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        fontWeight: 'bold',
        textAlign: 'left',
        width: 310,
        paddingLeft: 20,
        paddingTop: 30
    },
    listItemText: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'left',
        width: '80%',
        paddingLeft: 20
    },
    listItemTextTaken: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'left',
        width: '60%',
        paddingLeft: 20
    },
    listItemTextAction: {
        fontSize: 16,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'right',
        width: '30%',
        paddingRight: 20,
        fontWeight: 'bold'
    },
    listItemDetail: {
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        width: '100%',
        paddingTop: 15,
        paddingBottom: 15,
        //paddingRight: 10
    },
    titleLine: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    titleLineTaken: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    spacer: {
        width: 10
    },
    spacerReserved: {
        width : 25
    },
    listItemLinkText: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'left',
        width: 310,
        paddingLeft: 20,
        textDecorationLine: 'underline'
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
    listHolderNameTitle: {
        fontSize: 20,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'center',
        width: 310
    },
})

export default SubscribedToList;