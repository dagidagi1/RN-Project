import AsyncStorage from '@react-native-async-storage/async-storage';
import post_api from '../api/post_api';
import PostApi from '../api/post_api';
import { AuthData } from './auth_model';
let authData: AuthData
const loadStorageData = async () => {
    try {
        const authDataSerialized = await AsyncStorage.getItem('@AuthData');
        if (authDataSerialized) {
            authData = JSON.parse(authDataSerialized);
            return JSON.parse(authDataSerialized);
        }
        else
            console.log('async storage @AuthData is undifined! ')
    } catch (error) {
        console.log("Error loading data from memory")
    }
    return null
}

export type Post = {
    id: string,
    txt: string,
    usrId: string,
    img: string
}
const addPost = async (imgUri: string, txt: string) => {
    const authData: AuthData = await loadStorageData()
    const post = {
        id: '',
        txt: txt,
        usrId: authData.id,
        img: imgUri
    }
    const res: any = await PostApi.addPost(post, authData.accToken)
    if (res.status == 200) {
        console.log("Post Added!")
        console.log(res.body)
        return true
    }
    else
        console.log("STATUS: " + JSON.stringify(res))
    return false
}

const getAllPosts = async () => {
    authData = await loadStorageData()
    let posts: Array<Post> = []
    const res: any = await PostApi.getAllPosts(authData.accToken)
    if (res.status == 200) {
        res.data.data.forEach((element: any) => {
            const p: Post = {
                id: element._id,
                img: element.imgUri,
                txt: element.txt,
                usrId: element.usrId
            }
            posts.push(p)
        })
    }
    return posts
}
const getMyPosts = async () => {
    const allPosts: Array<Post> = await getAllPosts()
    return allPosts.filter(post => post.usrId == authData.id)
}
// const getPostById = (id: string) => {
//     let pst: Post = { id: '', txt: '', usrId: '', img: '' }
//     posts.forEach((i) => {
//         if (i.id === id) pst = i
//     })
//     return pst
// }
const editPost = async (postId: String, txt: String, imgUri: String) => {
    let data = { 'id': postId }
    if (txt != '') Object.assign(data, { 'txt': txt })
    if (imgUri != '') Object.assign(data, { 'imgUri': imgUri })
    const res = await post_api.editPost(postId, data, authData.accToken)
    if (res.status == 200)
        return true
    return false
}
export default { getAllPosts, addPost, getMyPosts, editPost }