import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Linking, Modal, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';

import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';


const priceValueOptions = [
    { label: '£ Not specified', value: '0' },
    { label: 'Under £10', value: '1' },
    { label: '£10-£20', value: '2' },
    { label: '£20-£50', value: '3' },
    { label: '£50-£100', value: '4' },
    { label: 'Over £100', value: '5' },
];


const Item = ({ listItem, itemId, detail, price, links, toggleDetail, setToggleDetail, currentList }) => {

    const itemPrice = priceValueOptions.find(itemPrice => price === itemPrice.value);
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedItemId, setSelectedItemId] = useState('');

    const navigation = useNavigation();

    return (
    <TouchableOpacity onPress={()=> {setToggleDetail(toggleDetail === itemId ? '' : itemId)}} >
        {itemId === toggleDetail ? (
            <View style={styles.listItemDetail}>
                <View style={styles.titleLine}>
                    <Text style={styles.listItemText, styles.listItemTextTitle}>{listItem}</Text> 
                    <TouchableOpacity onPress={() => navigation.navigate('Edit Item', {data: currentList, itemId: itemId, listId: currentList._id})}>
                        <Feather name="edit" size={24} color={Colors.textDark} />
                    </TouchableOpacity>
                    <View style={styles.spacer}></View>
                    {/* <TouchableOpacity onPress={() => {setModalVisible(true); setSelectedItem(listItem); setSelectedItemId(itemId)}}>
                        <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity> */}
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
                <Text style={styles.listItemText} style={styles.listItemTextTitle}>{listItem}</Text> 
                <TouchableOpacity onPress={() => {navigation.navigate('Edit Item', {data: currentList, itemId: itemId, listId: currentList._id}); setToggleDetail(itemId)}}>
                    <Feather name="edit" size={24} color={Colors.textDark} />
                </TouchableOpacity>
                <View style={styles.spacer}></View>
                {/* <TouchableOpacity onPress={() => {setModalVisible(true); setSelectedItem(listItem); setSelectedItemId(itemId)}}>
                    <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity> */}
             </View>
        }

    </TouchableOpacity>
  )
};




const ChosenList = ({ route }) => {
    const navigation = useNavigation();
    
    const { listId, listName, listDate } = route.params;
    const [myCurrentList, setMyCurrentList] = useState({})
    const [toggleDetail, setToggleDetail] = useState();
    console.log(myCurrentList)

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity style={styles.editListButton} onPress={() => navigation.navigate('Edit List', {oldListName: listName, oldListId: listId, oldListDate: listDate })}>
                <FontAwesome name="edit" size={24} color={Colors.textLight} />
            </TouchableOpacity>
          ),
        });
      }, [navigation]);

    const fetchData = async () => {
        try {
            console.log('Chosen list :', listId)
            const token = await SecureStore.getItemAsync('token')
            const myList = await axios.get(`${BASE_URL}/lists/${listId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMyCurrentList(myList.data) 
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        void fetchData();
    }, [listId]);
    

    //console.log(Object.keys(myCurrentList))

        if (Object.keys(myCurrentList).length > 0) {
            return ( 
                <SafeAreaView style={styles.container}>
                    <KeyboardAvoidingView style={styles.KAVContainer}>
                        <View style={styles.header}></View>
                        <TouchableOpacity style={styles.shareListButton} onPress={() => {}}>
                            <Text style={styles.shareListButtonText}>Share this list</Text>
                            <Feather name="share" size={24} color={Colors.textLight} />
                        </TouchableOpacity>
                            { (myCurrentList.listItems.length > 0) ? (
                                <FlatList 
                                    data={myCurrentList.listItems}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <Item 
                                            listId={listId}
                                            listItem={item.item} 
                                            itemId={item._id} 
                                            detail={item.detail} 
                                            price={item.price} 
                                            links={item.links} 
                                            toggleDetail={toggleDetail}
                                            setToggleDetail={setToggleDetail}
                                            currentList={myCurrentList}
                                            />)}
                                    keyExtractor={item => item._id}
                                    style={styles.list}
                                />
                                ) : (
                                    <View style={styles.noItemsTextContainer}>
                                        <Text style={styles.noItemsText}>There are no items on your list</Text>
                                    </View>
                                )
                            }
                        
                        <TouchableOpacity style={styles.addItemButton} onPress={() => navigation.navigate('Add New Item', {
                                listId: listId,
                                listName: myCurrentList.listName
                            })}
                        >
                            <Text style={styles.addItemText}>Add a new item</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </SafeAreaView>
          );
        } else {
            return null;
        }
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
    listItem: {
        flexDirection: 'row',
        minHeight: 70,
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: 9,
        width: '95%',
        //paddingRight: 12,
        backgroundColor: Colors.secondary,
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
    },
    // listItem: {
    //     minHeight: 50,
    //     borderWidth: 2,
    //     borderColor: Colors.primary,
    //     borderRadius: 15,
    //     flexDirection: 'row',
    //     justifyContent: 'flex-start',
    //     alignItems: 'flex-start',
    //     marginBottom: 10,
    //     marginLeft: 8,
    //     width: '95%',
    //     paddingRight: 10,
    //     paddingBottom: 10,
    //     paddingTop: 10,
        
    // },
    header: {
        height: 80,
        width: '100%',
        backgroundColor: Colors.primary,
        color: 'black'
    },
    shareListButton: {
        flexDirection: 'row',
        backgroundColor: Colors.button,
        borderRadius: 5,
        width: '90%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 100,
        marginTop: 45,
        marginBottom: 10
    },
    shareListButtonText: {
        color: Colors.textLight,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        paddingRight: 10
    },
    title: {
        paddingTop: 60,
        paddingBottom: 40,
        fontSize: 26,
        color: Colors.primary,
        fontWeight: 'bold'
    },
    list: {
        paddingTop: 60,
        paddingBottom: 100,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    addItemButton:{
        height: 60,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
        width: 250
    },
    addItemText:{
        color: Colors.textLight,
        fontSize: 22,
        fontWeight: 'bold'
    },
    listItemTextTitle: {
        fontSize: 18,
        color: Colors.primary,
        paddingBottom: 5,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '87%',
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
        width: '87%',
        paddingLeft: 20
    },
    listItemDetail: {
        minHeight: 70,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        marginLeft: 9,
        width: '95%',
        paddingTop: 15,
        paddingBottom: 15,
        //paddingRight: 10,
        backgroundColor: Colors.secondary,
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
    },
    titleLine: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    spacer: {
        width: 10
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
    editListButton:{
        paddingRight: 15
    }
})

export default ChosenList;