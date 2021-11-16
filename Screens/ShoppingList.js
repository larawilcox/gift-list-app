import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, KeyboardAvoidingView, SectionList, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import Colors from '../Constants/Colors';
import { SubscribedListsData as Data } from '../Data/SubscribedListsData';
import { BASE_URL } from '../Constants/Api';


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
    const navigation = useNavigation();

    const fetchData = async () => {
        try {
            const token = await SecureStore.getItemAsync('token')
            const myShoppingList = await axios.get(`${BASE_URL}/users/me/shoppingList`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            //console.log('my shopping list', myShoppingList)

            const sectionListData = myShoppingList.data.map(section => {
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
    

    

    const Item = ({ friend, data }) => {
    
    const currentListItems = data.data
    
            return (
                <View>
                <Text style={styles.listItemTextTaken}>{data.list}</Text>
                {currentListItems.map((item) => (
                    <TouchableOpacity onPress={()=> {setToggleDetail(toggleDetail === item._id ? '' : item._id)}}>
                    {item._id === toggleDetail ? (
                        <View style={styles.listItemDetail}>
                            <View style={styles.titleLineTaken}>
                                <Text style={styles.listItemTextTaken, styles.listItemTextTitle}>{item.item}</Text> 
                                <Text style={styles.listItemTextAction, styles.listItemTextTitle}>{item.actions.action}</Text>
                            </View>
            
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
                        <View style={styles.listItem}>
                                <Text style={styles.listItemTextTaken}>{item.item}</Text>
                                <Text style={styles.listItemTextAction, styles.listItemTextTitle}>{item.actions.action}</Text>
                        </View>
                    }
                </TouchableOpacity>
                ))}
                </View>
              )
    }

    
    return (
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView>
                <SectionList
                    sections={sectionListData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item, section }) => <Item friend={section} data={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.headerText}>{title}'s Gifts</Text>
                    )}
                />             
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
    text: {
        textAlign: 'center'
    },
    listItem: {
        flexDirection: 'row',
        minHeight: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        width: '98%',
        paddingRight: 40
    },
    listNameText: {
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left',
        width: 310,
        paddingLeft: 20
    },
    headerText: {
        fontSize: 20,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 5,
        paddingTop: 20,
        width: '100%', 
        backgroundColor: Colors.background
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
        width: 310,
        paddingLeft: 20,
        textDecorationLine: 'underline'
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
    titleLineTaken: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})

export default ShoppingList;