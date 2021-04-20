import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import MyLists from './Screens/MyLists';
import SubscribedLists from './Screens/SubscribedLists';
import Settings from './Screens/Settings';
import ChosenList from './Screens/ChosenList';
import AddList from './Screens/AddList';
import AddItem from './Screens/AddItem';
import EditList from './Screens/EditList';
import EditItem from './Screens/EditItem';

import Colors from './Constants/Colors';

import { AntDesign } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();
const MyListStack = createStackNavigator();


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
      <MyListStack.Screen name="My Lists" component={MyLists} />
      <MyListStack.Screen 
          name="Chosen List" 
          component={ChosenList} 
          options={({ route, navigation }) => ({
              title: route.params.listName,
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
    </MyListStack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
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
              paddingBottom: 13
            },
            style:{
              backgroundColor: Colors.background,
              paddingLeft: 25,
              paddingRight: 25,
              marginTop: 15
            },
            tabStyle: {
              borderRadius: 15,
            }
          }}

      >
        <Tab.Screen name="My Lists" component={MyListStackScreen} />
        <Tab.Screen name="Friends' Lists" component={SubscribedLists} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
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
