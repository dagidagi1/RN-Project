import { FC, useEffect, useState } from "react"
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, TouchableHighlight, ToastAndroid } from "react-native"
import user_model, { User } from "./models/user_model"
import { post_model, Post } from "./models/post_model"
import { Ionicons } from '@expo/vector-icons';
import myColors from "./myColors"

const PostFeed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [posts, setPosts] = useState<Array<Post>>([])
  const [myPostsFlag, setFlag] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  post_model.getInstance().setMyPostSetter(setFlag)
  const func = async () => {
    setPosts(await post_model.getInstance().getPosts())
  }
  const onRefresh = () => {
    setIsRefreshing(true)
    post_model.getInstance().getPosts().then((p) => {
      setPosts(p)
      setIsRefreshing(false)
    })
  }
  useEffect(() => {
    func()
  }, [myPostsFlag])
  useEffect(() => {
    const updateOnFocus = navigation.addListener('focus', async () => {
      setPosts(await post_model.getInstance().getPosts())
    })
  }, [navigation])
  const editPost = (postId: string, userName: String, usrAvatar: string, img: string, txt: String) => {
    navigation.navigate('EditPost', { postId: postId, userName: userName, usrAvatar: usrAvatar, img: img, txt: txt, editFlag: true })
  }
  const deletePost = async (postId: string) => {
    setIsRefreshing(true)
    if (await post_model.getInstance().deletePost(postId))
      ToastAndroid.show("Deleted!", ToastAndroid.LONG)
    else ToastAndroid.show("Not Deleted!", ToastAndroid.LONG)
    onRefresh()
  }
  return (
    <View style={styles.backContainer}>
      <FlatList
        data={posts}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        keyExtractor={(post) => post.id.toString()}
        renderItem={({ item }) => (
          <PostItem
            id={item.id}
            usrId={item.usrId}
            image={item.img}
            text={item.txt}
            editPost={editPost}
            editFlag={myPostsFlag}
            deletePost={deletePost}
          />
        )}
      ></FlatList>
    </View>
  );
}
export const PostItem: FC<{ id: String; image: any, text: String, usrId: string, editPost: (userId: string, userName: String, usrAvatar: string, img: string, txt: String) => void, deletePost: (id: string) => void, editFlag: boolean }> = ({
  id,
  image,
  text,
  usrId,
  editPost,
  deletePost,
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

      <View style={styles.separetor} />
      <View style={styles.title}>
        {avatarUri == '' ? (
          <ActivityIndicator animating={true} size="large" />
        ) : (
          <Image style={styles.avatar} source={{ uri: avatarUri }} />
        )}
        <Text style={styles.name}>{username}</Text>
        {editFlag ? (
          <View style={{ flexDirection: 'row' }}>
            <TouchableHighlight onPress={() => editPost(id.toString(), username, avatarUri, image, text)} underlayColor={'gray'} style={styles.editIcon}>
              <Ionicons name="pencil-outline" size={30} color={myColors.tabIcon}></Ionicons>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => deletePost(id.toString())} underlayColor={'gray'} style={styles.editIcon}>
              <Ionicons name="trash-outline" size={30} color={myColors.tabIcon}></Ionicons>
            </TouchableHighlight>
          </View>
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
    backgroundColor: myColors.mainBackground
  },
  container: {
    flex: 1,
    marginTop: 10,
  },
  separetor: {
    flex: 1,
    height: 1,
    backgroundColor: myColors.tabIcon,
    marginHorizontal: 10,
    marginVertical: 5
  },
  title: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 'bold'
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
    fontSize: 20,
    color: myColors.tabIcon,
  },
  image: {
    margin: 10,
    width: '95%',
    borderRadius: 3,
    aspectRatio: 1
  },
  text: {
    marginHorizontal: 10,
    marginVertical: 5,
    color: myColors.tabIcon,
    marginBottom: 8,
    alignSelf: 'center'
  },
  editIcon: {
    alignSelf: "flex-end",
    marginEnd: 10
  }
})