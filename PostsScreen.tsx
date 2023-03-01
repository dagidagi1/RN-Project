import React, { FC, useEffect } from "react";;
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostFeed from "./PostsList";
import AddPostScreen from "./AddPostScreen";

const PostsScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="PostsList" component={PostFeed} options={{ title: 'Posts List' }}/>
            <Stack.Screen name="EditPost" component={AddPostScreen} options={{ title: 'Post Details' }} />
        </Stack.Navigator>
    )
}
export default PostsScreen