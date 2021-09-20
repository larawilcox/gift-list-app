import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Linking, Modal, KeyboardAvoidingView } from 'react-native';

import Colors from '../Constants/Colors';

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

const Item = ({ listItem, itemId, detail, price, links, data, reservedItemsArray, setReservedItemsArray, toggleDetail, setToggleDetail, purchasedItemsArray, setPurchasedItemsArray }) => {



    const itemPrice = priceValueOptions.find(itemPrice => price === itemPrice.value);
    const [reservedModalVisible, setReservedModalVisible] = useState(false);
    const [purchasedModalVisible, setPurchasedModalVisible] = useState(false);
    const [reserveButtonDisabled, setReserveButtonDisabled] = useState(false);

    

    const updateReservedItemsArray = (itemId) => {

        const itemToUpdateIndex = reservedItemsArray.findIndex(item => item === itemId);

        if (itemToUpdateIndex >=0) {
            reservedItemsArray.splice(itemToUpdateIndex, 1);
        } else {
            setReservedItemsArray([
                ...reservedItemsArray,
                itemId
            ])
        }
        setReservedModalVisible(false);
    }


    const updatePurchasedItemsArray = (itemId) => {

        const itemToUpdateIndexPurchase = purchasedItemsArray.findIndex(item => item === itemId);
        const itemToUpdateIndexReserved = reservedItemsArray.findIndex(item => item === itemId);

        if (itemToUpdateIndexPurchase >=0) {
            purchasedItemsArray.splice(itemToUpdateIndexPurchase, 1);
        } else {
            setPurchasedItemsArray([
                ...purchasedItemsArray,
                itemId
            ]);
            if (itemToUpdateIndexReserved >=0) {
                reservedItemsArray.splice(itemToUpdateIndexReserved, 1);
            }
        }
        setPurchasedModalVisible(false);
    }


    return (
    <TouchableOpacity onPress={()=> {setToggleDetail(toggleDetail === itemId ? '' : itemId)}} >
        {itemId === toggleDetail ? (
            <View style={styles.listItemDetail}>
                <View style={styles.titleLine}>
                    <Text style={styles.listItemText, styles.listItemTextTitle}>{listItem}</Text> 
                    {purchasedItemsArray.find(item => item === itemId) ? (
                    <View style={styles.spacerReserved}></View> 
                ) : (
                    <TouchableOpacity onPress={() => {setReservedModalVisible(true)}}>
                        {reservedItemsArray.find(item => item === itemId) ? (
                            <AntDesign name="unlock" size={24} color="black" />
                        ) : (
                            <AntDesign name="lock1" size={24} color="black" />
                        )}
                    </TouchableOpacity>
                ) }
                    <View style={styles.spacer}></View>
                    <TouchableOpacity onPress={() => {setPurchasedModalVisible(true)}}>
                        {purchasedItemsArray.find(item => item === itemId) ? (
                            <MaterialCommunityIcons name="cart-remove" size={24} color="black" />
                            ) : (
                            <AntDesign name="shoppingcart" size={24} color="black" />
                        )}
                    </TouchableOpacity>
                </View>
                
                { price ?  
                    <Text style={styles.listItemText}>{itemPrice.label}</Text>
                    : null
                }
                { detail ?
                <Text style={styles.listItemText}>{detail}</Text>
                : null
                }
                {links ? 
                links.map(link => 
                    <Text style={styles.listItemLinkText} key={link.link} onPress={() => Linking.openURL(link.link)}>{link.linkDescription ? link.linkDescription : 'Link'}</Text>
                    )
                : null
                }
            </View>
        ) :
            <View style={styles.listItem}>
                <Text style={styles.listItemText}>{listItem}</Text>
                {purchasedItemsArray.find(item => item === itemId) ? (
                    <View style={styles.spacerReserved}></View> 
                ) : (
                    <TouchableOpacity onPress={() => {setReservedModalVisible(true)}}>
                        {reservedItemsArray.find(item => item === itemId) ? (
                            <AntDesign name="unlock" size={24} color="black" />
                        ) : (
                            <AntDesign name="lock1" size={24} color="black" />
                        )}
                    </TouchableOpacity>
                ) }
                <View style={styles.spacer}></View>
                <TouchableOpacity onPress={() => {setPurchasedModalVisible(true)}}>
                    {purchasedItemsArray.find(item => item === itemId) ? (
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
                    {reservedItemsArray.find(item => item === itemId) ? (
                        <Text style={styles.text}>Release this item</Text> ) : (
                            <Text style={styles.text}>Reserve this item</Text>
                        )
                    }   
                    <Text style={styles.text}>{listItem} ?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => updateReservedItemsArray(itemId)}>
                        {reservedItemsArray.find(item => item === itemId) ? (
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
                    {purchasedItemsArray.find(item => item === itemId) ? (
                        <Text style={styles.text}>Release this item</Text> ) : (
                            <Text style={styles.text}>Purchase this item</Text>
                        )
                    }
                    <Text style={styles.text}>{listItem} ?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => updatePurchasedItemsArray(itemId)}>
                        {purchasedItemsArray.find(item => item === itemId) ? (
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




const SubscribedToList = ({ route }) => {
    
    const { friendId, listId } = route.params;
    let { data } = route.params;

    const currentFriend = data.find(friend => friend.email === friendId);
    const currentList = currentFriend.lists.find(list => list.listId === listId);


    const [toggleDetail, setToggleDetail] = useState();
    
    const [reservedItemsArray, setReservedItemsArray] = useState([]);
    const [purchasedItemsArray, setPurchasedItemsArray] = useState([]);

    

    

    

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.KAVContainer}>
                <Text style={styles.listHolderNameTitle}>{currentFriend.forename}'s Lists</Text>
                { (currentList.listItems.length > 0) ? (
                <FlatList 
                    data={currentList.listItems}
                    renderItem={({ item }) => (
                        <Item 
                            listItem={item.item} 
                            itemId={item.itemId} 
                            detail={item.detail} 
                            price={item.price} 
                            links={item.links} 
                            data={data} 
                            reservedItemsArray={reservedItemsArray}
                            setReservedItemsArray={setReservedItemsArray}
                            toggleDetail={toggleDetail}
                            setToggleDetail={setToggleDetail}
                            purchasedItemsArray={purchasedItemsArray}
                            setPurchasedItemsArray={setPurchasedItemsArray}
                             />)}
                    keyExtractor={item => item.itemId}
                    style={styles.list}
                />
                 ) : (
                    <View style={styles.noItemsTextContainer}>
                        <Text style={styles.noItemsText}>There are no items on your list</Text>
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
        //paddingRight: 40,
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