import { FC, useEffect, useState } from "react"
import { StyleSheet, Button, View, Text, Image, FlatList, TextInput, ImageBackground, TouchableOpacity, SafeAreaView } from "react-native"
import { Message } from "./models/message_model"
import message_model from "./models/message_model"
import { Colors } from "react-native/Libraries/NewAppScreen"
import post_model from "./models/post_model"
const currUsr = "Dagi"
const getUsrAvatar = (usrId: string) => {
    return require('./assets/o.png')
}

const PostFeed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [posts, setMsgs] = useState(post_model.getAllPosts())
    const [counter, setCounter] = useState<number>(0)
    const [text, onChangeText] = useState('')
    const sendMessage = () => {
        console.log(text)
        message_model.addMessage(text,currUsr)
        onChangeText('')
    }
    useEffect(() => {
        const updateOnFocus = navigation.addListener('focus', () => {
            setMsgs(post_model.getAllPosts())
        })
    })
    return (
        <View style={styles.container}>
          <FlatList
            data={posts}
            keyExtractor={(post) => post.id.toString()}
            renderItem={({ item }) => (
              <PostItem
                id={item.id}
                image={require('./assets/Facebook_icon.png')}
                avatar={require('./assets/usr_icon.png')}
                text={item.txt}
              />
            )}
          ></FlatList>
        </View>
      );
}
export const PostItem: FC<{ id: String; image: any, avatar: any, text: String }> = ({
    id,
    image,
    avatar,
    text
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Image source={avatar} style={styles.avatar}/>
        </View>
        <Image source={image} style={styles.image}/>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  };
export default PostFeed
const styles = StyleSheet.create({
    backContainer: {
        flex: 1,
        backgroundColor: 'red',
    },
    container: {
        flex: 1,
        marginTop: 10,
    },
    title: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    }, 
    avatar: {
        marginLeft: 8,
        width: 30,
        height: 30
    },
    name: {
        marginLeft: 10,
        color: 'blue',
    },
    image:{
        margin: 10,
        width: '95%',
        borderRadius: 3,
    },
    text:{
        marginLeft: 10,
        color: 'blue',
        marginBottom: 8,
        alignSelf: 'center'
    }
})