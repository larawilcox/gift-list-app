import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Linking, Modal, KeyboardAvoidingView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ItemReserve from '../Components/ItemReserve';
import ItemPurchase from '../Components/ItemPurchase';
import updateAction from '../Utils/updateAction';

import Colors from '../Constants/Colors';



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
    const [reservedModalVisible, setReservedModalVisible] = useState(false);
    const [purchasedModalVisible, setPurchasedModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({
                                                        _id: '',
                                                        actions: {  personId: '',
                                                                    action: ''
                                                                    },
                                                                    detail: '',
                                                                    item: '',
                                                                    links: [],
                                                                    price: ''
                                                    });
    console.log('data: ', data)
 
    const [myId, setMyId] = useState('');
    


    const fetchUserId = async () => {
        const userId = await AsyncStorage.getItem('userId');
        setMyId(userId);
        // console.log('userId: ', userId)
    }

    useEffect(() => {
        void fetchUserId();
    }, []);

    
    //console.log('myId: ', myId)
    const [toggleDetail, setToggleDetail] = useState();

    const ReserveModal = () => {
        // console.log('reserve item: ', currentItem)
        return (
            <Modal
                visible={reservedModalVisible}
                transparent={true}
            >
                    <View style={styles.contentContainer}>
                    <View style={styles.modalInputContainer}>
                        {(currentItem.actions.personId === myId && currentItem.actions.action === 'reserved' ) ? (
                            <Text style={styles.text}>Release this item</Text> ) : (
                                <Text style={styles.text}>Reserve this item</Text>
                            )
                        }   
                        <Text style={styles.text}>{currentItem.item} ?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() =>  {updateAction({item: currentItem, action: 'reserved', userId: myId, listId: data.id, setData, setModalVisible: setReservedModalVisible})}}>
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
                </View>
            </Modal>
        )
    }

    const PurchaseModal = () => {
        return (
            <Modal
                visible={purchasedModalVisible}
                transparent={true}
            >
                    <View style={styles.contentContainer}>
                    <View style={styles.modalInputContainer}>
                        {(currentItem.actions.personId === myId && currentItem.actions.action === 'purchased' ) ? (
                            <Text style={styles.text}>Release this item</Text> ) : (
                                <Text style={styles.text}>Purchase this item</Text>
                            )
                        }
                        <Text style={styles.text}>{currentItem.item} ?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => {updateAction({item: currentItem, action: 'purchased', userId: myId, listId: data.id, setData, setModalVisible: setPurchasedModalVisible})}}>
                            {(currentItem.actions.personId === myId && currentItem.actions.action === 'purchased' ) ? (
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
                </View>
            </Modal>
        )
    }
    
            
    


    const Item = ({ data, myId, itemId, toggleDetail, setToggleDetail }) => {
        
        const currentItem = data.data.find(item => item._id === itemId)
        console.log('item: ', currentItem)
       

        const itemPrice = priceValueOptions.find(itemPrice => currentItem.price === itemPrice.value);
        
    
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
        <TouchableOpacity style={styles.listItem} onPress={()=> {setToggleDetail(toggleDetail === itemId ? '' : itemId)}}>
            
                {itemId === toggleDetail ? (
                    <View style={styles.listItemDetail}>
                        <View style={styles.titleLine}>
                            <Text style={styles.listItemText, styles.listItemTextTitle}>{currentItem.item}</Text> 
                        </View>
                        { currentItem.price ?  
                            <Text style={styles.listItemText}>{itemPrice.label}</Text>
                            : null
                        }
                        {currentItem.detail ?
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
                ) : (
                    <View style={styles.listItemDetail}>
                        <Text style={styles.listItemText}>{currentItem.item}</Text>
                    </View>
                )}
                <View style={styles.shoppingIcons}>
                    <ItemReserve item={currentItem} userId={myId} listId={data.id} setReservedModalVisible={setReservedModalVisible} setCurrentItem={setCurrentItem} />
                    <ItemPurchase item={currentItem} userId={myId} listId={data.id} setPurchasedModalVisible={setPurchasedModalVisible} setCurrentItem={setCurrentItem} />
                </View>
                
        </TouchableOpacity>
      )
    };
};



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar  barStyle="light-content" translucent={true} backgroundColor={Colors.primary} />
            <KeyboardAvoidingView style={styles.KAVContainer}>
            <View style={styles.header}></View>
                <View style={styles.listView}>
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
                        contentContainerStyle={{ alignItems: 'center', paddingBottom: 50 }}
                    />
                    ) : (
                        <View style={styles.noItemsTextContainer}>
                            <Text style={styles.noItemsText}>There are no items on this list</Text>
                        </View>
                    )
                    }
                </View>
                <ReserveModal />
                <PurchaseModal />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.background,
        color: Colors.textLight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    KAVContainer: {
        position: 'relative',
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    header: {
        height: 80,
        width: '100%',
        backgroundColor: Colors.primary,
        color: 'black'
    },
    listView: {
        backgroundColor: Colors.secondary,
        marginTop: -40,
        paddingBottom: 75,
        width: '95%',
        alignItems: 'center',
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
    },
    listItem: {
        flexDirection: 'row',
        minHeight: 50,
        width: '95%',
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: Colors.background,
        paddingRight: 8
    },
    titleLineTaken: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '95%'
    },
    list: {
        paddingTop: 30,
        width: '100%'
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
        //paddingLeft: 20
    },
    noItemsTextContainer: {
        flex: 1,
        minHeight: 75
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
        //paddingLeft: 20
    },
    listItemTextTaken: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'left',
        width: '65%',
    },
    listItemTextAction: {
        fontSize: 16,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'right',
        width: '35%',
        paddingRight: 10,
        fontWeight: 'bold'
    },
    listItemDetail: {
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        //marginBottom: 10,
        width: '75%',
        paddingTop: 15,
        paddingBottom: 10,
    },
    titleLine: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingRight: 8
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
    listHolderNameTitle: {
        fontSize: 20,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'center',
        width: 310
    },
    shoppingIcons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignSelf: 'flex-start',
        paddingTop: 15,
        width: '20%'
    },
    listItemWrapper: {
        width: '100%'
    },
    listItemTitleLine: {
        width: '85%'
    }
})

export default SubscribedToList;