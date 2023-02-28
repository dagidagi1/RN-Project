import React, { FC, useEffect, useState } from "react";
import { View, TextInput, Text, Button, StyleSheet, Image, ActivityIndicator, ToastAndroid, Modal, TouchableOpacity } from "react-native";
import post_model, { Post } from "./models/post_model";
import * as ImagePicker from 'expo-image-picker';
import user_model, { User } from "./models/user_model";
import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostFeed from "./PostsList";
import AddPostScreen from "./AddPostScreen";
import { Register } from "./Login";
const ProfileScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ShowProfile" component={Profile} options={{ title: 'Profile' }} />
            <Stack.Screen name="editProfile" component={Register} options={{ title: 'Edit profile' }} />
        </Stack.Navigator>
    )
}
const Profile: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [loading, setLoading] = useState<boolean>(false)

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [imgUri, setImgUri] = useState('/')
    let usr:User
    const getData = async () => {
        usr = await user_model.getSelf()
        setName(usr.name.toString())
        setEmail(usr.email.toString())
        setPhone(usr.phone.toString())
        setImgUri(usr.img.toString())
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setLoading(true)
            await getData()
            setLoading(false)
        })
        return unsubscribe
    }, [navigation])
    return (

        <View style={styles.container}>

            {loading ? (
                <ActivityIndicator animating={true} size="large" />
            ) : (
                <Image style={styles.avatar} source={{ uri: imgUri }}></Image>
            )}
            <ActivityIndicator animating={loading} size="large" />
            <TextInput
                style={styles.input}
                placeholder="Name"
                editable={false}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                editable={false}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone number"
                editable={false}
                value={phone}
                onChangeText={setPhone}
            />
            <View style={styles.buttonContainer}>
                <Button title="Edit" onPress={() => navigation.navigate('editProfile', {'editFlag':true,'username':name ,'avatarUri':imgUri,'email':email,'phone':phone })} />
            </View>
        </View >
    )
}
export default ProfileScreen

const styles = StyleSheet.create({
    cButtonsRow: {
        flex: 1,
        flexDirection: 'row',
        margin: 15,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 20,
    },
    errText: {
        marginBottom: 12,
        textAlign: 'center',
        color: 'red',
        fontWeight: 'bold'
    },
    buttonContainer: {
        margin: 6,
        alignSelf: 'center',
        flexWrap: "wrap",

    },
    imgContainer: {
        margin: 6,
        flex: 1,
        alignSelf: 'center',
        flexWrap: "wrap",

    },
    avatarAndNameContainer: {
        margin: '10%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    senderNameTxtBox: {
        fontSize: 20,
        flex: 1,
        flexDirection: 'row',
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center'
    },
    avatar: {
        height: 250,
        aspectRatio: 1,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    cIcons: {
        flex: 1,
        height: 100,
        aspectRatio: 1,
        justifyContent: 'center',
        alignSelf: 'center'
    },
})