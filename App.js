import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MyLists from './Screens/MyLists';
import SubscribedLists from './Screens/SubscribedLists';
import Settings from './Screens/Settings';
import ChosenList from './Screens/ChosenList';
import AddList from './Screens/AddList';
import AddItem from './Screens/AddItem';
import EditList from './Screens/EditList';
import EditItem from './Screens/EditItem';
import SubscribedToList from './Screens/SubscribedToList';
import ShareList from './Screens/ShareList';
import Login from './Screens/Login';
import ForgotPassword from './Screens/ForgotPassword';
import PasswordChange from './Screens/PasswordChange';
import SignUp from './Screens/SignUp';


import Colors from './Constants/Colors';

import { AntDesign } from '@expo/vector-icons'; 

const LoginStack = createStackNavigator();
const MyAppTab = createBottomTabNavigator();
const MyListStack = createStackNavigator();
const SubscribedListsStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function MyAppTabScreen() {
  const insets = useSafeAreaInsets();
  return (
  <MyAppTab.Navigator
          initialRouteName="My Lists"
          tabBarOptions={{
            activeBackgroundColor: Colors.primary,
            inactiveBackgroundColor: Colors.background,
            activeTintColor: Colors.textLight,
            inactiveTintColor: Colors.primary,
            labelStyle: {
              fontSize: 16,
              fontWeight: 'bold',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 13,
            },
            style:{
              backgroundColor: Colors.background,
              paddingLeft: 25,
              paddingRight: 25,
              paddingTop: 15,
              height: insets.bottom === 0 ? insets.bottom + 75 : insets.bottom + 60,
              paddingBottom: insets.bottom === 0 ? 15 + insets.bottom : insets.bottom
            },
            tabStyle: {
              borderRadius: 15,
            }
          }}

      >
        <MyAppTab.Screen name="My Lists" component={MyListStackScreen} />
        <MyAppTab.Screen name="Friends' Lists" component={SubscribedListsStackScreen} />
        <MyAppTab.Screen name="Settings" component={SettingsStackScreen} />
      </MyAppTab.Navigator>
  )
}

function MyListStackScreen() {
  return (
    <MyListStack.Navigator
      initialRouteName="My Lists" 
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 26
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
              headerRight: () => (
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('My Lists')}>
                  <AntDesign name="close" size={24} color={Colors.primary} />
                </TouchableOpacity>
              ),
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
                <AntDesign name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            )
            })} />
      <MyListStack.Screen 
          name ="Add New Item" 
          component={AddItem}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity style={styles.closeButton} onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: "My Lists" }]
              })}>
                <AntDesign name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            ),
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => navigation.reset({
                  index: 0,
                  routes: [{ name: "My Lists" }]
                })}
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
                  <AntDesign name="close" size={24} color={Colors.primary} />
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
                  <AntDesign name="close" size={24} color={Colors.primary} />
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
                  <AntDesign name="close" size={24} color={Colors.primary} />
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


function SubscribedListsStackScreen() {
  return (
    <SubscribedListsStack.Navigator
      initialRouteName="Subscribed Lists" 
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.primary,
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
              title: route.params.listName,
              headerRight: () => (
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                  <AntDesign name="close" size={24} color={Colors.primary} />
                </TouchableOpacity>
              ),
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => navigation.goBack()}
                />
              ),
              headerBackTitle: 'Back'
              })}
            />
    </SubscribedListsStack.Navigator>
  )
}


function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
        initialRouteName="Settings" 
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.primary,
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
          headerMode='screen'
          screenOptions={{
            backgroundColor: Colors.secondary,
            headerStyle: {
              backgroundColor: Colors.background,
              shadowColor: 'transparent'
            },
            headerShown: false
        }} >
          <LoginStack.Screen options={{ title: '' }} name="Login" component={Login} />
          <LoginStack.Screen name="SignUp" component={SignUp} />
          <LoginStack.Screen name="Home" component={MyAppTabScreen} />
          <LoginStack.Screen name="ForgotPassword" component={ForgotPassword} />
          <LoginStack.Screen name="PasswordChange" component={PasswordChange} />
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
    paddingRight: 10
  }
});
