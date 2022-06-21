import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, KeyboardAvoidingView, SectionList, TouchableOpacity, Linking, StatusBar, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../Constants/Colors';
import { SubscribedListsData as Data } from '../Data/SubscribedListsData';
import { BASE_URL } from '../Constants/Api';

import ItemReserve from '../Components/ItemReserve';
import ItemPurchase from '../Components/ItemPurchase';
import updateAction from '../Utils/updateAction';


const priceValueOptions = [
    { label: '£ Not specified', value: '0' },
    { label: 'Under £10', value: '1' },
    { label: '£10-£20', value: '2' },
    { label: '£20-£50', value: '3' },
    { label: '£50-£100', value: '4' },
    { label: 'Over £100', value: '5' },
];

const ShoppingList = () => {

    const [sectionListData, setSectionListData] = useState([])
    const [toggleDetail, setToggleDetail] = useState();
    const [reservedModalVisible, setReservedModalVisible] = useState(false);
    const [purchasedModalVisible, setPurchasedModalVisible] = useState(false);
    const [myId, setMyId] = useState('');
    const [listId, setListId] = useState('');
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


    const navigation = useNavigation();

    const fetchData = async () => {
        try {
            const token = await SecureStore.getItemAsync('token')
            const myShoppingList = await axios.get(`${BASE_URL}/users/me/shoppingList`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            //console.log('my shopping list', myShoppingList.data);

            const filteredlistdata = myShoppingList.data.filter(friend => {
               const lists = friend.lists.filter(list => list.items.length > 0)
                if (lists.length > 0) {
                    return {friend: friend};
                }
            })

            //console.log('filteredListData', filteredlistdata);

            const sectionListData = filteredlistdata.map(section => {
                return { title: section.forename, _id: section._id, email: section.email, data: section.lists.map(list => {
                    return { list: list.listName, id: list.listId, data: list.items }
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

    React.useEffect(() => {
        const refreshList = navigation.addListener('focus', () => {
          void fetchData();
        });
      }, [navigation]);

    const fetchUserId = async () => {
        const userId = await AsyncStorage.getItem('userId');
        setMyId(userId);
        // console.log('userId: ', userId)
    }

    useEffect(() => {
        void fetchUserId();
    }, []);

    //   console.log('SLD', sectionListData)

      const ReserveModal = () => {
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
                            <TouchableOpacity style={styles.button} onPress={() =>  updateAction({item: currentItem, action: 'reserved', userId: myId, listId, setModalVisible: setReservedModalVisible})}>
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
        // console.log('item: ', currentItem)
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
                            <TouchableOpacity style={styles.button} onPress={() => {updateAction({item: currentItem, action: 'purchased', userId: myId, listId, setModalVisible: setPurchasedModalVisible}); console.log('listId: ', listId)}}>
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
    

    

    const Item = ({ friend, data }) => {
    
    const currentListItems = data.data
    const listId = data.id
    // console.log('current list items: ', currentListItems)
    // console.log('data: ', data)
    
        if (currentListItems.length > 0) {
            return (
                <View style={styles.listItem}>
                    <Text style={styles.listNameText}>{data.list}</Text>
                    {currentListItems.map((item) => (
                        <TouchableOpacity style={styles.listItemItems} key={item._id} onPress={()=> {setToggleDetail(toggleDetail === item._id ? '' : item._id)}}>
                        {item._id === toggleDetail ? (
                            <View style={styles.listItemDetail}>
                                <View style={styles.titleLineTaken}>
                                    <Text style={styles.listItemTextTaken}>{item.item}</Text> 
                                    <View style={styles.shoppingIcons}>
                                        <ItemReserve item={item} userId={myId} listId={listId} setReservedModalVisible={setReservedModalVisible} setCurrentItem={setCurrentItem} setListId={setListId} />
                                        <ItemPurchase item={item} userId={myId} listId={listId} setPurchasedModalVisible={setPurchasedModalVisible} setCurrentItem={setCurrentItem} setListId={setListId} />
                                    </View>
                                </View>
                                {/* {console.log('item: ', item)} */}
                                { item.price ?  
                                    <Text style={styles.listItemText}>{priceValueOptions.find(itemPrice => item.price === itemPrice.value).label}</Text>
                                    : null
                                }
                                { item.detail ?
                                <Text style={styles.listItemText}>{item.detail}</Text>
                                : null
                                }
                                {item.links ? 
                                item.links.map(link => 
                                    <Text style={styles.listItemLinkText} key={link.link} onPress={() => Linking.openURL(link.link)}>{link.linkDescription ? link.linkDescription : 'Link'}</Text>
                                    )
                                : null
                                }
                            </View>
                        ) :
                            <View style={styles.listItemDetail}>
                                <View style={styles.titleLineTaken}>
                                    <Text style={styles.listItemTextTaken}>{item.item}</Text>
                                    <View style={styles.shoppingIcons}>
                                        <ItemReserve item={item} userId={myId} listId={listId} setReservedModalVisible={setReservedModalVisible} setCurrentItem={setCurrentItem} setListId={setListId} />
                                        <ItemPurchase item={item} userId={myId} listId={listId} setPurchasedModalVisible={setPurchasedModalVisible} setCurrentItem={setCurrentItem} setListId={setListId} />
                                    </View>
                                </View>
                            </View>
                        }
                    
                </TouchableOpacity>
                
                ))}
                
                </View>
              ) 
        } else {
            return null
        }
    }

    
    return (
            <SafeAreaView style={styles.container}>
                <StatusBar  barStyle="light-content" translucent={true} backgroundColor={Colors.primary} />
                <KeyboardAvoidingView style={styles.KAVContainer}>
                    <View style={styles.header}></View>
                    <View style={styles.listView}>
                        <SectionList
                            sections={sectionListData}
                            keyExtractor={(item, index) => item + index}
                            contentContainerStyle={styles.sectionList}
                            style={styles.width}
                            renderItem={({ item, section }) => <Item friend={section} data={item} />}
                            renderSectionHeader={({ section: { title } }) => (
                                <Text style={styles.headerText}>{title}'s Gifts</Text>
                            )}
                        />  
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
        height: 60,
        width: '100%',
        backgroundColor: Colors.primary,
        color: 'black'
    },
    listView: {
        backgroundColor: Colors.secondary,
        marginTop: -30,
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
    sectionList:{
        marginBottom: 30,
    },
    width: {
        width: '100%'
    },
    text: {
        textAlign: 'center'
    },
    listItem: {
        minHeight: 50,
        width: '90%',
        marginLeft: '5%',
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: Colors.background,
    },
    listItemItems: {
        width: '95%'
    },
    listNameText: {
        fontSize: 18,
        color: Colors.textDark,
        textAlign: 'left',
        width: '100%',
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingTop: 10
    },
    headerText: {
        fontSize: 20,
        color: Colors.textDark,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 5,
        paddingTop: 20,
        width: '100%', 
        backgroundColor: Colors.secondary,
        paddingLeft: 20
    },
    listItemDetail: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        width: '100%',
        paddingTop: 15,
        paddingBottom: 15,
    },
    titleLine: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    listItemText: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'left',
        width: '80%',
        paddingLeft: 20
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
    listItemLinkText: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        textAlign: 'left',
        width: '95%',
        paddingLeft: 20,
        textDecorationLine: 'underline'
    },
    listItemTextTaken: {
        fontSize: 18,
        color: Colors.textDark,
        paddingBottom: 5,
        textAlign: 'left',
        width: '60%',
        paddingLeft: 10
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
    titleLineTaken: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    shoppingIcons: {
        width: '40%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 10,
        alignSelf: 'flex-start',
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
})

export default ShoppingList;