import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, SectionList, TouchableOpacity, Modal, TextInput, StatusBar, Platform } from 'react-native';
import { useNavigation, useFocusEffect, useScrollToTop } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 

import Colors from '../Constants/Colors';
import { BASE_URL } from '../Constants/Api';


const SubscribedLists = () => {

    const [sectionListData, setSectionListData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [sharecode, setSharecode] = useState('');
    const [subscribeCodeError, setSubscribeCodeError] = useState('');

    const navigation = useNavigation();
    const ref = useRef();

    console.log(sectionListData)
    

    const fetchData = async () => {
        try {
            const token = await SecureStore.getItemAsync('token')
            const mySubscribedLists = await axios.get(`${BASE_URL}/users/me/subscribedLists`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const sectionListData = mySubscribedLists.data.map(section => {
                return { title: section.forename, _id: section._id, email: section.email, data: section.lists.map(list => {
                    return { list: list.listName, id: list._id, data: list.listItems }
                })}
            });
            setSectionListData(sectionListData);
        } catch (e) {
            console.log(e);
        }
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity style={styles.addListButton} onPress={() => setModalVisible(true)}>
                <FontAwesome name="plus" size={24} color={Colors.textLight} />
            </TouchableOpacity>
          ),
        });
      }, [navigation]);

    useEffect(() => {
        void fetchData();
    }, []);

    const subscribe = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');

            const subscribeToList = await axios.patch(`${BASE_URL}/users/me/subscribedLists`, {
                shareCode: sharecode
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                }
            });
            setModalVisible(false);
            setSharecode('');
            setSubscribeCodeError('');
            void fetchData();
        } catch (e) {
            console.log(e.response);
            if (e.response && e.response.status === 409) {
                setSubscribeCodeError("You're already subscribed to this list")
            } else {
                setSubscribeCodeError('This is not a valid code.');
            }
        }
    };
    

    

    const Item = ({ friend, data }) => {
        //console.log('Data: ', data)
        // console.log('List: ', list.id)
        //console.log(friend)
    
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Subscribed To List', {
                ownerId: friend._id,
                listId: data._id,
                ownerName: friend.title,
                data: data, 
                listName: data.list
            })}>
                <Text style={styles.listNameText} ellipsizeMode='tail' numberOfLines={2}>{data.list}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar  barStyle="light-content" translucent={true} backgroundColor={Colors.primary} />
            <KeyboardAvoidingView style={styles.KAVContainer}>
                <View style={styles.header}></View>
                <View style={styles.listView}>
                    {sectionListData.length > 0 ? (
                    <SectionList
                        ref={ref}
                        sections={sectionListData}
                        keyExtractor={(item, index) => item + index}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.sectionList}
                        renderItem={({ item, section }) => <Item friend={section} data={item} />}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.headerText}>{title}'s Lists</Text>
                        )}
                    />
                ) : (
                    <Text style={styles.noItemsText}>Subscribe to a list to start.</Text>
                )}    

                            <Modal 
                                visible={modalVisible}
                                transparent={true}
                            >
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalInputContainer}>
                                        <View style={styles.closeButtonContainer}>
                                            <TouchableOpacity style={styles.closeButton} onPress={() => {setModalVisible(false); setSharecode(''); setSubscribeCodeError('')}}>
                                                <AntDesign name="close" size={20} color={Colors.textDark} />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.modalHeaderText}>Enter your share code:</Text>
                                        <TextInput
                                            style={styles.modalInput}
                                            onChangeText={setSharecode}
                                            value={sharecode}
                                            placeholder="enter code"
                                            textAlignVertical='center'
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                        />
                                        { subscribeCodeError ? (
                                            <Text>{subscribeCodeError}</Text>
                                        ) : null
                                        }
                                        <TouchableOpacity style={styles.modalButton} onPress={subscribe}>
                                            <Text style={styles.modalButtonText}>Subscribe</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </Modal>
                </View>
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
    sectionList:{
        marginBottom: 30,
        width: '100%'
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center'
    },
    addListButton:{
        paddingRight: 20
    },
    buttonText:{
        color: Colors.textLight,
        fontSize: 18,
        fontWeight: 'bold'
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
        paddingLeft: 10
    },
    listItem: {
        flexDirection: 'row',
        minHeight: 50,
        width: '95%',
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        //marginLeft: 9,
        //paddingRight: 12,
        backgroundColor: Colors.background,
    },
    listNameText: {
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'left',
        width: '95%',
        paddingLeft: 20
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
    text: {
        textAlign: 'center'
    },

    
    modalContainer: {
        //backgroundColor: Colors.background,
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
    modalHeaderText: {
        fontSize: 26,
        color: Colors.textDark,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 5,
        paddingTop: 20
    },
    modalInput: {
        marginTop: 30,
        width: '80%',
        height: 50,
        backgroundColor: Colors.secondary,
        paddingBottom: 20,
        justifyContent: 'center',
        marginBottom: 20,
        //shadow and elevation props
        shadowColor: '#2B2D2F',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 20,
        shadowColor: '#A9A9A9',
        textAlign: 'center',
        fontSize: 16
    },
    modalButton:{
        height: 60,
        backgroundColor: Colors.button,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        width: 135,
        marginTop: 50,
    },
    modalButtonText:{
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold'
    },
    closeButtonContainer: {
        alignItems: 'flex-end',
        width: '100%',
        paddingRight: 25
    }
})

export default SubscribedLists;