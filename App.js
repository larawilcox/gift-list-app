import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import MyLists from './Screens/MyLists';
import SubscribedLists from './Screens/SubscribedLists';
import Settings from './Screens/Settings';
import ChosenList from './Screens/ChosenList';
import AddList from './Screens/AddList';
import AddItem from './Screens/AddItem';
import EditList from './Screens/EditList';
import EditItem from './Screens/EditItem';
import SubscribedToList from './Screens/SubscribedToList';
import ShoppingList from './Screens/ShoppingList';
import ShareList from './Screens/ShareList';
import Login from './Screens/Login';
import ResetPassword from './Screens/ResetPassword';
import SignUp from './Screens/SignUp';


import Colors from './Constants/Colors';

import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 


const LoginStack = createStackNavigator();
const MyAppTab = createBottomTabNavigator();
const MyListStack = createStackNavigator();
const SubscribedListsStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const FriendsTab = createMaterialTopTabNavigator();

function MyAppTabScreen() {
  const insets = useSafeAreaInsets();
  return (
  <MyAppTab.Navigator
          initialRouteName="My Lists"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
              let iconColor = Colors.textGrey;
              if (route.name === 'My Lists') { 
                iconColor = focused ? Colors.textDark : Colors.textGrey
                return <Ionicons name="list" size={24} color={iconColor} />
              } else if (route.name === 'Friends\' Lists') {
                iconColor = focused ? Colors.textDark : Colors.textGrey
                return <Ionicons name="people-outline" size={24} color={iconColor} />
              } else if (route.name === 'Settings') {
                iconColor = focused ? Colors.textDark : Colors.textGrey
                return <Ionicons name="settings-outline" size={24} color={iconColor} />
              }
            }
          })
        }
          tabBarOptions={{
            activeBackgroundColor: Colors.secondary,
            inactiveBackgroundColor: Colors.secondary,
            activeTintColor: Colors.textDark,
            inactiveTintColor: Colors.textGrey,
            labelStyle: {
              fontSize: 14,
              fontWeight: 'bold',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 13,
            },
            style:{
              backgroundColor: Colors.secondary,
              paddingLeft: 25,
              paddingRight: 25,
              paddingTop: 15,
              height: insets.bottom === 0 ? insets.bottom + 95 : insets.bottom + 75,
              paddingBottom: insets.bottom === 0 ? 15 + insets.bottom : insets.bottom
            },
            tabStyle: {
              borderRadius: 15,
            }
          }}

      >
        <MyAppTab.Screen name="My Lists" component={MyListStackScreen} />
        <MyAppTab.Screen name="Friends' Lists" component={FriendsTabScreen} />
        <MyAppTab.Screen name="Settings" component={SettingsStackScreen} />
      </MyAppTab.Navigator>
  )
}

function CustomHeader(props) {
  return (
    <View style={styles.customHeaderView}>
      <Text style={styles.customHeaderTextTitle}>My Lists</Text>
      <Text style={styles.customHeaderViewList} ellipsizeMode='tail' numberOfLines={1}>{props.listName}</Text>
    </View>
  )
} 

function MyListStackScreen() {
  return (
    <MyListStack.Navigator
      initialRouteName="My Lists"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
          // height: 120,
          
        },
        headerTintColor: Colors.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 26,
          paddingTop: 15,
          alignItems: 'center'
        }
      }}
    >
      <MyListStack.Screen 
          name="My Lists" 
          component={MyLists} />
      <MyListStack.Screen 
          name="Chosen List" 
          component={ChosenList}
          options={({ route, navigation }) => ({
              title: route.params.listName,
              headerTitle: (props) => <CustomHeader {...props} listName={route.params.listName} />,
              // headerRight: () => (
              //   <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('Edit List', {oldListName: listName, oldListId: listId, oldListDate: listDate, data: data})}>
              //     <FontAwesome name="edit" size={24} color={Colors.textLight} />
              //   </TouchableOpacity>
              // ),
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => navigation.navigate('My Lists')}
                />
              ),
              headerBackTitle: 'Back'
              })} />
      <MyListStack.Screen 
          name="Add New List" 
          component={AddList}
          options={({ route, navigation }) => ({
            headerRight: () => (
              <TouchableOpacity style={styles.closeButton} onPress={() => navigation.popToTop()}>
                <AntDesign name="close" size={24} color={Colors.textLight} />
              </TouchableOpacity>
            )
            })} />
      <MyListStack.Screen 
          name ="Add New Item" 
          component={AddItem}
          options={({ navigation }) => ({
            title: "New item",
            headerRight: () => (
              <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <AntDesign name="close" size={24} color={Colors.textLight} />
              </TouchableOpacity>
            ),
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => navigation.goBack()}
              />
            ),
            headerBackTitle: 'Back'
            })} />
      <MyListStack.Screen 
            name ="Edit List" 
            component={EditList}
            options={({ navigation }) => ({
              headerRight: () => (
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.popToTop()}>
                  <AntDesign name="close" size={24} color={Colors.textLight} />
                </TouchableOpacity>
              ),
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => navigation.popToTop()}
                />
              ),
              headerBackTitle: 'Back'
              })} />
        <MyListStack.Screen 
            name ="Edit Item" 
            component={EditItem}
            options={({ navigation }) => ({
              headerRight: () => (
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                  <AntDesign name="close" size={24} color={Colors.textLight} />
                </TouchableOpacity>
              ),
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => navigation.goBack()}
                />
              ),
              headerBackTitle: 'Back'
              })} />
        <MyListStack.Screen 
            name ="Share List" 
            component={ShareList}
            options={({ navigation }) => ({
              headerRight: () => (
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                  <AntDesign name="close" size={24} color={Colors.textLight} />
                </TouchableOpacity>
              ),
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => navigation.goBack()}
                />
              ),
              headerBackTitle: 'Back'
              })} />
    </MyListStack.Navigator>
  )
}

function CustomHeaderSubscribed(props) {
  return (
    <View style={styles.customHeaderView}>
      <Text style={styles.customHeaderTextTitle}>{props.listOwner}'s Lists</Text>
      <Text style={styles.customHeaderViewList} ellipsizeMode='tail' numberOfLines={1}>{props.listName}</Text>
    </View>
  )
} 

function SubscribedListsStackScreen() {
  return (
    <SubscribedListsStack.Navigator
      initialRouteName="Subscribed Lists" 
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
        headerTintColor: Colors.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 26
        }
      }}
    >
        <SubscribedListsStack.Screen name="Subscribed Lists" component={SubscribedLists} />
        <SubscribedListsStack.Screen 
            name="Subscribed To List" 
            component={SubscribedToList} 
            options={({ route, navigation }) => ({
              headerTitle: (props) => <CustomHeaderSubscribed {...props} listOwner={route.params.ownerName} listName={route.params.listName} />,
              // headerRight: () => (
              //   <TouchableOpacity style={styles.closeButton} onPress={() => navigation.reset({
              //     index: 0,
              //     routes: [{ name: "Subscribed Lists" }]
              //   })}>
              //     <AntDesign name="close" size={24} color={Colors.textLight} />
              //   </TouchableOpacity>
              // ),
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: "Subscribed Lists" }]
                  })}
                />
              ),
              headerBackTitle: 'Back'
              })}
            />
    </SubscribedListsStack.Navigator>
  )
}

function FriendsTabScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
    <FriendsTab.Navigator
      initialRouteName="Subscribed Lists"
      screenOptions={{
        tabBarActiveBackgroundColor: Colors.primary,
        tabBarItemStyle: {
          backgroundColor: Colors.primary
        }
      }}
      tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: Colors.textGrey,
        labelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabStyle: {
          borderColor: Colors.primary,
          borderWidth: 1,
          backgroundColor: Colors.background,
          
        }
      }}
      style={{
        marginTop: Platform.OS === 'ios' ? 10 : 20,
        paddingTop: Platform.OS === 'ios' ? 0 : 20
      }}
      
    >
      <FriendsTab.Screen name="Subscribed Lists" component={SubscribedListsStackScreen} />
      <FriendsTab.Screen name="Shopping List" component={ShoppingList} />
    </FriendsTab.Navigator>
    </SafeAreaView>
  )
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
        initialRouteName="Settings" 
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerTintColor: Colors.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 26
          }
        }}
    >
      <SettingsStack.Screen name="Settings" component={Settings}></SettingsStack.Screen>
    </SettingsStack.Navigator>
  )
}


export default function App() {
  return (
    <NavigationContainer>
      <LoginStack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary,
              elevation: 0, // remove shadow on Android
              shadowOpacity: 0, // remove shadow on iOS
              // height: 120,
              
            },
            headerTintColor: Colors.textLight,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 26,
              paddingTop: 15,
              alignItems: 'center'
            }
          }} >
          <LoginStack.Screen 
            name="Login" 
            component={Login}
            options={{
              headerLeft: () => null
            }}
          />
          <LoginStack.Screen 
            name="Sign Up" 
            component={SignUp}
            options={{
              headerLeft: () => null
            }}
          />
          <LoginStack.Screen name="Home" component={MyAppTabScreen} options={{ headerShown: false }} />
          <LoginStack.Screen name="Reset Password" component={ResetPassword} />
      </LoginStack.Navigator>
    </NavigationContainer>
  )   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    paddingRight: 10,
  },
  customHeaderView: {
    width: '100%',
  },
  customHeaderTextTitle: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 26,
    paddingTop: 25,
    textAlign: 'center'
  },
  customHeaderViewList: {
    color: Colors.textLight,
    fontSize: 20,
    paddingTop: 5,
    textAlign: 'center'
  }
});
