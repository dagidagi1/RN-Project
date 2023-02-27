import { FC, useEffect, useState } from "react"
import { StyleSheet, Button, View, Text, Image, FlatList, TextInput, ImageBackground, TouchableOpacity, SafeAreaView, ActivityIndicator, TouchableHighlight } from "react-native"
import { Message } from "./models/message_model"
import message_model from "./models/message_model"
import user_model, { User } from "./models/user_model"
import { Colors } from "react-native/Libraries/NewAppScreen"
import post_model, { Post } from "./models/post_model"
import { Ionicons } from '@expo/vector-icons';

const PostFeed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [posts, setPosts] = useState<Array<Post>>([])
  const [myPosts, setMyPosts] = useState<Array<Post>>([])
  const [myPostsFlag, setFlag] = useState<boolean>(false)
  const [text, onChangeText] = useState('')
  useEffect(() => {
    const updateOnFocus = navigation.addListener('focus', async () => {
      setPosts(await post_model.getAllPosts())
      setMyPosts(await post_model.getMyPosts())
    })
  })
  const onRowSelected = (postId: string, userName: String, usrAvatar: string, img: string, txt: String) => {
    navigation.navigate('EditPost', { postId: postId, userName: userName, usrAvatar: usrAvatar, img: img, txt: txt, editFlag: true })
  }
  return (
    <View style={styles.container}>
      <Button title='Show All/My' onPress={() => setFlag(!myPostsFlag)} />
      <FlatList
        data={myPostsFlag ? myPosts : posts}
        keyExtractor={(post) => post.id.toString()}
        renderItem={({ item }) => (
          <PostItem
            id={item.id}
            usrId={item.usrId}
            image={item.img}
            text={item.txt}
            onRowSelected={onRowSelected}
            editFlag={myPostsFlag}
          />
        )}
      ></FlatList>
    </View>
  );
}
export const PostItem: FC<{ id: String; image: any, text: String, usrId: string, onRowSelected: (userId: string, userName: String, usrAvatar: string, img: string, txt: String) => void, editFlag: boolean }> = ({
  id,
  image,
  text,
  usrId,
  onRowSelected,
  editFlag
}) => {
  const [avatarUri, setAvatarUri] = useState('')
  const [username, setUsername] = useState<String>('')
  const setUsrData = async () => {
    const usr: User = await user_model.getUser(usrId)
    setAvatarUri(usr.img.toString())
    setUsername(usr.name)
  }
  setUsrData()
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        {avatarUri == '' ? (
          <ActivityIndicator animating={true} size="large" />
        ) : (
          <Image style={styles.avatar} source={{ uri: avatarUri }} />
        )}
        <Text style={styles.name}>{username}</Text>
        {editFlag ? (
          <TouchableHighlight onPress={() => onRowSelected(id.toString(), username, avatarUri, image, text)} underlayColor={'gray'} style={styles.editIcon}>
            <Ionicons name="pencil-outline" size={30} color={'red'}></Ionicons>
          </TouchableHighlight>
        ) : (<View></View>)}
      </View>
      {image == '' ? (
        <ActivityIndicator animating={true} size="large" />
      ) : (
        <Image source={{ uri: image }} style={styles.image} />
      )}

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
    justifyContent: 'space-between'
  },
  avatar: {
    marginLeft: 10,
    width: 30,
    height: 30,
    aspectRatio: 1
  },
  name: {
    marginLeft: 10,
    flex: 1,
    color: 'red',
  },
  image: {
    margin: 10,
    width: '95%',
    borderRadius: 3,
    aspectRatio: 1
  },
  text: {
    marginLeft: 10,
    color: 'blue',
    marginBottom: 8,
    alignSelf: 'center'
  },
  editIcon: {
    alignSelf: "flex-end",
    marginEnd: 10
  }
})