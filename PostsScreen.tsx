import React, { FC, useEffect, useState } from "react";
import { View, TextInput, Text, Button, StyleSheet, Image, ActivityIndicator, ToastAndroid, Modal, TouchableOpacity } from "react-native";
import post_model, { Post } from "./models/post_model";
import * as ImagePicker from 'expo-image-picker';
import user_model from "./models/user_model";
import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostFeed from "./PostsList";
import AddPostScreen from "./AddPostScreen";

const PostsScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {

    useEffect(() => {
    })
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="PostsList" component={PostFeed} options={{ title: 'Posts List' }}/>
            <Stack.Screen name="EditPost" component={AddPostScreen} options={{ title: 'Post Details' }} />
        </Stack.Navigator>
    )
}
export default PostsScreen

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
        aspectRatio: 1,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
    },

})