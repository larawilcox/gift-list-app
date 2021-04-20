import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Linking, Modal, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Colors from '../Constants/Colors';

import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 




const ChosenList = ({ route }) => {
    
    const { listId } = route.params;
    let { data } = route.params;

    const navigation = useNavigation();

    const currentList = data.find(list => list.listId === listId);
    let dataItems = currentList.listItems;

    const currentListIndex = data.findIndex(list => list.listId === listId);

    const [toggleDetail, setToggleDetail] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedItemId, setSelectedItemId] = useState('');


    const deleteItemFromChosenList = () => {
        const itemToDeleteIndex = data[currentListIndex].listItems.findIndex(item => item.itemId === selectedItemId);

        data[currentListIndex].listItems.splice(itemToDeleteIndex, 1)


        setModalVisible(false);
    }


    const Item = ({ listItem, itemId, detail, links, data }) => (
        <TouchableOpacity onPress={()=> {setToggleDetail(toggleDetail === itemId ? '' : itemId)}} >
            {itemId === toggleDetail ? (
                <View style={styles.listItemDetail}>
                    <View style={styles.titleLine}>
                        <Text style={styles.listItemText, styles.listItemTextTitle}>{listItem}</Text> 
                        <TouchableOpacity onPress={() => navigation.navigate('Edit Item', {data: data, itemId: itemId, listId: currentList.listId})}>
                            <Feather name="edit" size={24} color="black" />
                        </TouchableOpacity>
                        <View style={styles.spacer}></View>
                        <TouchableOpacity onPress={() => {setModalVisible(true); setSelectedItem(listItem); setSelectedItemId(itemId)}}>
                            <AntDesign name="delete" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
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
                    <TouchableOpacity onPress={() => {navigation.navigate('Edit Item', {data: data, itemId: itemId, listId: currentList.listId}); setToggleDetail(itemId)}}>
                        <Feather name="edit" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.spacer}></View>
                    <TouchableOpacity onPress={() => {setModalVisible(true); setSelectedItem(listItem); setSelectedItemId(itemId)}}>
                        <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity>
                 </View>
            }
        </TouchableOpacity>
      );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.KAVContainer}>
                { (dataItems.length > 0) ? (
                <FlatList 
                    data={dataItems}
                    renderItem={({ item }) => (
                        <Item listItem={item.item} itemId={item.itemId} detail={item.detail} links={item.links} data={data} />)}
                    keyExtractor={item => item.itemId}
                    style={styles.list}
                />
                ) : (
                    <View style={styles.noItemsTextContainer}>
                        <Text style={styles.noItemsText}>There are no items on your list</Text>
                    </View>
                )
                }
                <Modal
                    visible={modalVisible}
                    transparent={true}
                >
                        <View style={styles.contentContainer}>
                            <Text style={styles.text}>Delete Item</Text>
                            <Text style={styles.text}>{selectedItem} ?</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={deleteItemFromChosenList}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setModalVisible(false)}} style={styles.button}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </Modal>
                <TouchableOpacity style={styles.addItemButton} onPress={() => navigation.navigate('Add New Item', {
                        listId: listId,
                        data: data
                    })}
                >
                    <Text style={styles.addItemText}>Add Item</Text>
                </TouchableOpacity>
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
        width: 380,
        paddingRight: 40,
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
        width: 310,
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
        width: 310,
        paddingLeft: 20
    },
    listItemDetail: {
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        width: 380,
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 10
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
})

export default ChosenList;