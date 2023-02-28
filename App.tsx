import { FC, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, ActivityIndicator, TouchableHighlight } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ChatFeed from './Chat';
import Login, { Register } from './Login';
import { auth_model } from './models/auth_model'
import React from 'react';
import AddPostScreen from './AddPostScreen';
import PostsScreen from './PostsScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  )
}
const AppStack = () => {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: any;
        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Messages':
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
            break;
          case 'AddPost':
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#884DFF',
      tabBarInactiveTintColor: '#884DFF',
    })
    }>
      <Tab.Screen name="Home" component={PostsScreen} options={{
        headerRight: () => (
          <TouchableHighlight
            onPress={async () => await auth_model.logout()}
          ><Ionicons name={'log-out-outline'} size={30} color={'#884DFF'}/></TouchableHighlight>
        ),
      }} />
      <Tab.Screen name="Messages" component={ChatFeed} options={{ title: 'Chat' }} />
      <Tab.Screen name="AddPost" component={AddPostScreen} options={{ title: 'Add Post' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  )
}
const Loading = (message: string) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red'
      }}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
};
const App: FC = () => {
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  auth_model.init(setLogged).then((flag) => { if (flag) setLoading(false) })
  if (loading) return Loading('main')
  return (
    <NavigationContainer>
      {logged == true ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default function app() {
  return (
    <App></App>
  )
}
