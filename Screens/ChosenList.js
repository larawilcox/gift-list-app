import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Linking, Modal, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Colors from '../Constants/Colors';

import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 



const priceValueOptions = [
    { label: '£ Not specified', value: '0' },
    { label: 'Under £10', value: '1' },
    { label: '£10-£20', value: '2' },
    { label: '£20-£50', value: '3' },
    { label: '£50-£100', value: '4' },
    { label: 'Over £100', value: '5' },
];


const Item = ({ listItem, itemId, detail, price, links, data, toggleDetail, setToggleDetail, currentList, deleteItemFromChosenList }) => {

    const itemPrice = priceValueOptions.find(itemPrice => price === itemPrice.value);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedItemId, setSelectedItemId] = useState('');

    const navigation = useNavigation();



    return (
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
                <TouchableOpacity onPress={() => {navigation.navigate('Edit Item', {data: data, itemId: itemId, listId: currentList.listId}); setToggleDetail(itemId)}}>
                    <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.spacer}></View>
                <TouchableOpacity onPress={() => {setModalVisible(true); setSelectedItem(listItem); setSelectedItemId(itemId)}}>
                    <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity>
             </View>
        }

            <Modal
                visible={modalVisible}
                transparent={true}
            >
                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>Delete Item</Text>
                        <Text style={styles.text}>{selectedItem} ?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => {deleteItemFromChosenList(selectedItemId, setModalVisible)}}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {setModalVisible(false)}} style={styles.button}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </Modal>

    </TouchableOpacity>
  )
};




const ChosenList = ({ route }) => {
    
    const { listId } = route.params;
    let { data } = route.params;

    const navigation = useNavigation();

    const currentList = data.find(list => list.listId === listId);
    let dataItems = currentList.listItems;

    const currentListIndex = data.findIndex(list => list.listId === listId);

    const [toggleDetail, setToggleDetail] = useState();


    const deleteItemFromChosenList = (selectedItemId, setModalVisible) => {
        const itemToDeleteIndex = data[currentListIndex].listItems.findIndex(item => item.itemId === selectedItemId);

        data[currentListIndex].listItems.splice(itemToDeleteIndex, 1)


        setModalVisible(false);
    }


    

    
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.KAVContainer}>
                { (dataItems.length > 0) ? (
                <FlatList 
                    data={dataItems}
                    renderItem={({ item }) => (
                        <Item 
                            listItem={item.item} 
                            itemId={item.itemId} 
                            detail={item.detail} 
                            price={item.price} 
                            links={item.links} 
                            data={data} 
                            toggleDetail={toggleDetail}
                            setToggleDetail={setToggleDetail}
                            currentList={currentList}
                            deleteItemFromChosenList={deleteItemFromChosenList}
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
        marginLeft: 8,
        width: '95%',
        paddingRight: 10,
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
        width: '83%',
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
        width: '83%',
        paddingLeft: 20
    },
    listItemDetail: {
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        marginLeft: 8,
        width: '95%',
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