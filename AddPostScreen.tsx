import React, { FC, useEffect, useState } from "react";
import { View, TextInput, Text, Button, StyleSheet, Image, ActivityIndicator, ToastAndroid, Modal, TouchableOpacity } from "react-native";
import post_model, { Post } from "./models/post_model";
import * as ImagePicker from 'expo-image-picker';
import user_model from "./models/user_model";
import Ionicons from '@expo/vector-icons/Ionicons';


const AddPostScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    // FIXXX!!!!!!!!!
    const [text, setText] = useState<string>('')
    const [imgUri, setImgUri] = useState('')
    const [postId, setPostId] = useState<String>('')
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [newPhotoFlag, setNewPhotoFlag] = useState<boolean>(false)
    const [newTextFlag, setNewTextFlag] = useState<boolean>(false)
    const askPermition = async () => {
        try {
            const res = await ImagePicker.requestCameraPermissionsAsync()
            if (!res.granted) {
                console.log("no permissions!")
            }
        } catch (err) {

        }
    }
    const openCamera = async () => {
        setModalVisible(false);
        try {
            const res = await ImagePicker.launchCameraAsync();
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri;
                setImgUri(uri);
                setNewPhotoFlag(true)
            }
        } catch (err) {
            console.log("Open camera failed");
        }
    };

    const openGallery = async () => {
        setModalVisible(false);
        try {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri;
                setImgUri(uri);
                setNewPhotoFlag(true)
            }
        } catch (err) {
            console.log("Open gallery failed");
        }
    };
    const addPost = async () => {
        setLoading(true)
        let res, url
        if (imgUri == '') {
            // Default img
            url = 'http://192.168.59.246:3000/upload_files/usr_icon.jpg'
        }
        else {
            //user Image
            try {
                url = await user_model.uploadImage(imgUri)
            }
            catch (err) {
                console.log('Failed to upload img')
                url = 'http://192.168.59.246:3000/upload_files/usr_icon.jpg'
            }
        }
        try {
            res = await post_model.addPost(url, text)
        } catch (err) {
            console.log("Failed adding post")
        }
        if (res) {
            setLoading(false)
            ToastAndroid.show("Post uploaded!", ToastAndroid.LONG)
        }
        setLoading(false)
    }
    const editPost = async () => {
        setLoading(true)
        if (text == route.params.txt && !newPhotoFlag) {
            ToastAndroid.show("No changes done!", ToastAndroid.LONG)
        }
        else {
            let successFlag: boolean = false
            let url = ''
            if (newPhotoFlag) {
                try {
                    url = await user_model.uploadImage(imgUri)
                }
                catch (err) {
                    console.log('Failed to upload img')
                }
                if (newTextFlag) {
                    successFlag = await post_model.editPost(postId, text, url)
                }
                else {
                    successFlag = await post_model.editPost(postId, '', url)
                }
            }
            else {
                if (newTextFlag) {
                    successFlag = await post_model.editPost(postId, text, '')
                }
            }
            setLoading(false)
            if (successFlag) {
                ToastAndroid.show("Edited!", ToastAndroid.LONG)
            }
            else
                ToastAndroid.show("Post Edit Failed!", ToastAndroid.LONG)
        }
        navigation.goBack()
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            askPermition()
            if (route.params?.editFlag) {
                setEditMode(true)
                setText(route.params?.txt)
                setImgUri(route.params?.img)
                setPostId(route.params?.postId)
            }
        })
        return unsubscribe
    }, [navigation])

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={{ alignItems: "center" }}
                        onPress={openGallery}
                    >
                        <Ionicons name="images" size={80} color={'red'} />
                        <Text style={{ color: 'green' }}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ alignItems: "center" }}
                        onPress={openCamera}
                    >
                        <Ionicons name="camera" size={80} color={'green'} />
                        <Text style={{ color: 'green' }}>Camera</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.avatar}
            >
                {imgUri == "" ? (
                    <Ionicons name="camera-outline" size={200} color={'#884DFF'} />
                ) : (
                    <Image source={{ uri: imgUri }} style={styles.avatar} />
                )}
            </TouchableOpacity>
            <ActivityIndicator animating={loading} size="large" />
            <TextInput
                style={styles.input}
                placeholder="text"
                value={text}
                onChangeText={setText}
            />
            <Button title='Cancel' onPress={() => { navigation.goBack() }} />
            {editMode ? (<Button title='Edit' onPress={() => { editPost() }} />
            ) : (
                <Button title='Post' onPress={() => { addPost() }} disabled={(!newPhotoFlag && !newTextFlag)} />)}
        </View>
    );
}
export default AddPostScreen

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
    modalView: {
        flexDirection: "row",
        backgroundColor: 'gray',
        height: 140,
        position: "absolute",
        bottom: 5,
        width: "100%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "space-around",
    },
    addImageButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        aspectRatio: 1,
        height: 150,
    },
})