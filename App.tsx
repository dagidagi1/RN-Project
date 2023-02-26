import { StatusBar } from 'expo-status-bar';
import { FC, useEffect, useState, useMemo } from 'react';
import { CommonActions, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StyleSheet, View, Image, Text, TouchableOpacity, Button, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Student } from './models/student_model';
import StudentsList from './StudentsList';
import * as ImagePicker from 'expo-image-picker';
import ChatFeed from './Chat';
import Login, { Register } from './Login';
import { Post } from './models/post_model';
import { auth_model } from './models/auth_model'
import React from 'react';
import PostFeed from './PostsList';

const Home: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [msg, setMsg] = useState('non')
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    console.log('useEffect' + route.params?.newPostId)
    if (route.params?.newPostId) {
      setMsg(JSON.stringify(route.params?.newPostId))
    }
    if (route.params?.serial) {
      setCounter(route.params.serial)
    }
  })
  return (
    <View style={{
      flex: 1, alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Text>{'Home Screen #' + counter}</Text>
      <Button
        title="LogOut"
        onPress={auth_model.logout}
      />
      <Button
        title="Go to add student"
        onPress={() => navigation.navigate('AddStudentScreen')}
      />
      <Button
        title='Logout'
      />
    </View>
  );
}
const PostList: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  return(
    <PostFeed route={route} navigation={navigation}/>
  )
}
const PostEditScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [name, setName] = useState<string>(JSON.stringify(route.params?.name))
  const [counter, setCounter] = useState<number>(route.params?.serial)
  const [st, setSt] = useState<Student>(route.params?.st)
  useEffect(() => {
    navigation.setOptions({ title: counter })
    // if (route.params?.serial) {
    //   setCounter(route.params.serial)
    // }
    if (route.params?.st) {
      //setCounter(route.params.st.id)
    }
  })
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={require('./assets/o.png')}></Image>
      <TextInput
        style={styles.input}
        placeholder="input name"
        value={st.id}
      />
      <TextInput
        style={styles.input}
        value={st.name}
      />
      <TextInput
        style={styles.input}
        value={st.phone}
      />
      <Button title='Back' onPress={() => { navigation.navigate('') }} />
    </View>
  );
}
const PostViewScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [text, setText] = useState<string>('')
  const [img, setImg] = useState(require('./assets/o.png'))
  const [post, setPost] = useState<Post>({ id: '', txt: '', usrId: '', img: './assets/o.png' })
  //const [st, setSt] = useState<Student>(route.params?.st)
  useEffect(() => {
    //navigation.setOptions({ title: counter })
    if (route.params?.post) {
      setPost(route.params.post)
      setText(post.txt)
      //setImg(require(post.img))
    }
  })
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={img}></Image>
      <TextInput
        style={styles.input}
        placeholder="text"
        value={text}
      />
      <Button title='Back' onPress={() => { navigation.navigate('StudentsList') }} />
    </View>
  );
}
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
        let iconName;
        if (route.name === 'Home') {
          iconName = focused
            ? 'information-circle'
            : 'information-circle-outline';
        } else if (route.name === 'Details') {
          iconName = focused ? 'list-circle' : 'list-circle-outline';
        }
        // You can return any component that you like here!
        return <Ionicons size={size} color={color} />;
        //return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name="Home" component={Home} options={{ title: 'Home' }} />
      <Tab.Screen name="Details" component={PostViewScreen} options={{ title: 'Post Details' }} />
      <Tab.Screen name="AddStudentScreen" component={AddStudentScreen} options={{ title: 'Add Student' }} />
      <Tab.Screen name="StudentsList" component={StudentsList} options={{ title: 'Students list' }} />
      <Tab.Screen name="Messages" component={ChatFeed} options={{ title: 'Chat' }} />
      <Tab.Screen name="Posts" component={PostFeed} options={{ title: 'Posts' }} />
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
const AddStudentScreen: FC = () => {
  const onText1Change = () => { }
  const [text1, setText1] = useState('text 1')
  const onText2Change = () => { }
  const [text2, setText2] = useState('text 2')
  const onText3Change = () => { }
  const [text3, setText3] = useState('text 3')
  const pressHandler = () => { alert('pressHandler') }
  const [imageUri, setImageUri] = useState()
  const askPermition = async () => {
    try {
      const res = await ImagePicker.requestCameraPermissionsAsync()
      if (!res.granted) {
        console.log("no permissions!")
      }
    } catch (err) {

    }
  }
  useEffect(() => {
    askPermition()
  })
  return (
    <ScrollView>
      <View style={styles.container}>

        <Image style={styles.avatar} source={require('./assets/o.png')}></Image>
        <TextInput
          style={styles.input}
          onChangeText={onText1Change}
          placeholder="input name"
          value={text1}
        />
        <TextInput
          style={styles.input}
          onChangeText={onText2Change}
          value={text2}
        />
        <TextInput
          style={styles.input}
          onChangeText={onText3Change}
          value={text3}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={pressHandler}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pressHandler}>
            <Text style={styles.buttonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}















export default function app() {
  return (
    <App></App>
  )
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#aff',
    justifyContent: 'flex-start',
  },
  avatar: {
    marginTop: 10,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  cameraButton: {
    position: 'absolute',

  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignSelf: 'baseline',
  },
  button: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'yellow'
  },
  buttonText: {
    padding: 10
  }

});