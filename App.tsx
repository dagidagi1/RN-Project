import { FC, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, Text, ActivityIndicator, TouchableHighlight } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ChatFeed from './Chat';
import Login, { Register } from './Login';
import { auth_model } from './models/auth_model'
import React from 'react';
import AddPostScreen from './AddPostScreen';
import PostsScreen from './PostsScreen';
import ProfileScreen from './ProfileScreen';
import MySocket from './SocketService';
import myColors from './myColors';
import { post_model } from './models/post_model';

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
  const [my, setMy] = useState<boolean>(false)
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
      tabBarActiveTintColor: myColors.tabIcon,
      tabBarInactiveTintColor: myColors.tabIcon,
    })
    }>
      <Tab.Screen name="Home" component={PostsScreen} options={{
        headerRight: () => (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: myColors.tabIcon, margin: 5 }}>{'ALL'}</Text>
            <TouchableHighlight onPress={() => setMy(post_model.getInstance().press())} style={{ marginEnd: 10 }}>
              {my ? (
                <Ionicons name={'toggle'} size={30} color={myColors.tabIcon} />
              ) : (
                <Ionicons name={'toggle'} size={30} color={'gray'} style={{ transform: [{ scaleX: -1 }] }} />
              )}
            </TouchableHighlight>
            <Text style={{ color: myColors.tabIcon, margin: 5 }}>{'MY'}</Text>
          </View>
        ),
      }} />
      < Tab.Screen name="Messages" component={ChatFeed} options={{ title: 'Chat' }} />
      < Tab.Screen name="AddPost" component={AddPostScreen} options={{ title: 'Add Post' }} />
      < Tab.Screen name="Profile" component={ProfileScreen} options={{
        headerRight: () => (
          <TouchableHighlight
            onPress={async () => await auth_model.getInstance().logout()}
          ><Ionicons name={'log-out-outline'} size={30} color={myColors.tabIcon} /></TouchableHighlight>
        ),
      }} />
    </Tab.Navigator >
  )
}
const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: myColors.mainBackground
      }}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
};
const App: FC = () => {
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  auth_model.getInstance().init(setLogged).then((flag) => { if (flag) setLoading(false) })
  useEffect(() => {
    if (logged) MySocket.getInstance().createSocket()
  }, [logged])

  if (loading) return Loading()
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
